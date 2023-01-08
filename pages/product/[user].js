import React, { useEffect, useState } from "react";
import { getUserByDisplayName, updateUser } from "../../utils/db";
import { useRouter } from "next/router";
import { arrayUnion, serverTimestamp } from "firebase/firestore";
import emailjs from "emailjs-com";

const User = ({ id }) => {
  const [creator, setCreator] = useState(null);
  const [product, setProduct] = useState(null);
  const [email, setEmail] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    let productId = router.query.id;
    // retrieve product information from database
    let user = getUserByDisplayName(router.query.user.replace(".", " "))
      .then((user) => {
        console.log(user);
        setCreator(user);
        const product = user.products.filter((p) => p.id === productId)[0];
        console.log(product);
        setProduct(product);
      })
      .catch((err) => console.error(err));
  }, [router.isReady]);

  const addBuyer = async () => {
    console.log("adding buyer", creator);
    // new transaction data
    const paymentInfo = {
      email: email,
      timestamp: Date.now(),
      price: product.price,
    };

    // update the product with new buyer info
    const updatedProduct = {
      ...product,
      buyers: [...product.buyers, paymentInfo],
    };

    // get the index of the updated product
    const index = creator.products.findIndex((p) => p.id === product.id);

    // update the creator's product array with new product (this ensures product is not moved to end of array upon purchase)
    setCreator({
      ...creator,
      products: [
        ...creator.products.slice(0, index),
        updatedProduct,
        ...creator.products.slice(index + 1),
      ],
    });

    // update user in db
    await updateUser(creator.uid, {
      products: [...creator.products],
    });
  };

  const purchase = async (e) => {
    e.preventDefault();
    const templateParams = {
      to_email: email,
      product_name: product.name,
      product_description: product.description,
      product_price: product.price || "Free",
      product_url: product.url || "No URL provided",
    };

    // check if user has already purchased this item
    if (creator.products.filter((e) => e.email === email)) {
      alert("You have already purchased this item!");
    } else {
      console.log("adding buyer", email);

      emailjs
        .send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_TEMPLATE,
          templateParams,
          process.env.NEXT_PUBLIC_EMAILJS_KEY
        )
        .then((res) => {
          console.log("Email successfully sent!", res.status);
          alert("Item successfully purchased! Check your email for details.");
        })
        .catch((err) => console.error("Email failed to send", err));
    }
  };

  return (
    <div className="flex md:flex-row flex-col w-full h-full">
      <div className="p-8 w-full">
        {product?.image && (
          <>
            <img
              className="w-full h-72  rounded-md mb-4 object-cover"
              src={product?.image}
              alt="Product Image"
            />
            <hr className="my-4" />
          </>
        )}

        <h1 className="text-3xl font-bold mb-8">{product?.name}</h1>
        <p className="my-6">{product?.description}</p>
      </div>

      {/* Checkout - Mobile */}
      <div className="p-8 md:hidden border-t border-gray-300 bg-gray-100 h-full">
        <h1 className="font-bold text-xl">Checkout</h1>
        <p className="mt-2">Purchase this item to receive it in your email.</p>
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold">Total:</p>
          <p className="font-bold text-2xl">
            {product?.price}
            {/* {(product?.price?.includes(".")
              ? "$" + product?.price
              : "$" + product?.price + ".00") || "Free"} */}
          </p>
        </div>
        <form onSubmit={(e) => purchase(e)} className="space-y-2 mt-4">
          <input
            type="email"
            className="border p-1.5 border-gray-300 w-full rounded-md"
            placeholder="email@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />

          <button
            type="submit"
            className="bg-black text-white rounded-md px-4 py-2 hover:bg-gray-900"
          >
            Purchase now
          </button>
        </form>
      </div>

      {/* checkout - Desktop */}
      <div className="co-span-1 border-l border-gray-300 bg-gray-100 p-4 w-128 hidden md:block">
        <h1 className="font-bold text-lg">Checkout</h1>
        <p className="mt-2">Purchase this item to receive it in your email.</p>
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold">Total:</p>
          <p className="font-bold text-2xl">
            {product?.price}
            {/* {(product?.price?.includes(".")
              ? "$" + product?.price
              : "$" + product?.price + ".00") || "Free"} */}
          </p>
        </div>
        {/* Purchase (bottom) */}
        <div className="mt-4 ">
          <form onSubmit={(e) => purchase(e)} className="space-y-2">
            <input
              type="email"
              className="border p-1.5 border-gray-300 w-full rounded-md"
              placeholder="email@example.com"
              onChange={(event) => setEmail(event.target.value)}
            />

            <button
              type="submit"
              className="bg-black text-white rounded-md px-4 py-2 hover:bg-gray-900"
            >
              Purchase now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default User;
