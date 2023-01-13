import React, { useEffect, useState } from "react";
import { getUserByDisplayName, updateUser } from "../../utils/db";
import { useRouter } from "next/router";
import Modal from "../../components/UI/Modal";

const User = ({ id }) => {
  const [creator, setCreator] = useState(null);
  const [product, setProduct] = useState(null);
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    let productId = router.query.id;
    // retrieve product information from database
    let user = getUserByDisplayName(router.query.user.replace(".", " "))
      .then((user) => {
        setCreator(user);
        const product = user.products.filter((p) => p.id === productId)[0];

        setProduct(product);
      })
      .catch((err) => console.error(err));
  }, [router.isReady]);

  const addBuyer = async () => {
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
    const updatedProducts = [
      ...creator.products.slice(0, index),
      updatedProduct,
      ...creator.products.slice(index + 1),
    ];

    // update the creator in state
    setCreator({
      ...creator,
      products: updatedProducts,
    });

    // update user in db
    await updateUser(creator.uid, {
      products: updatedProducts,
    });
  };

  const sendEmails = async () => {
    const data = {
      to_email: email, // buyer's email
      from_email: creator.email, // creator's email
      product_name: product.name,
      product_description: product.description,
      product_price: product.price || "Free",
      product_url: product.url || "No URL provided",
    };

    await fetch("/api/purchase", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status == 200) {
          console.log("Email sent!");
        } else {
          console.log("something went wrong sending the email");
        }
      })
      .catch((err) => console.error(err));
  };

  const purchase = async (e) => {
    e.preventDefault();

    if (email === "") return;

    // check if user has already purchased this item
    if (
      creator.products
        .filter((e) => e.id === product.id)[0]
        .buyers.some((e) => e.email === email)
    ) {
      // if so, alert user
      setMessage(
        "You have already purchased this item! Please check your email for the receipt."
      );
      setModal(true);
    } else {
      // if not, add buyer to product and send email
      await addBuyer();
      await sendEmails();
      setMessage("Purchase successful!");
      setModal(true);
    }
  };

  return (
    <div className="flex md:flex-row flex-col w-full h-full">
      <Modal
        open={modal}
        setOpen={setModal}
        head={message == "Purchase successful!" ? "Success!" : "Error!"}
        message={message}
        action={() => setModal(false)}
        type={"confirm"}
      />
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
            placeholder="Email"
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
              placeholder="Your Email"
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
