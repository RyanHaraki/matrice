import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaLink } from "react-icons/fa";
import { useRouter } from "next/router";
import UploadWidget from "../../components/UploadWidget";
import { getUser, updateUser } from "../../utils/db";
import { saveFile } from "../../utils/storage";

const Create = ({ id }) => {
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // retrieve product information from database
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user = getUser(user.uid)
        .then((user) => {
          console.log(user);
          const product = user.products.filter((p) => p.id == id)[0];

          setUser(user);
          setProduct(product);
        })
        .catch((err) => console.error(err));
    } else {
      router.push("/");
    }
  }, []);

  const saveProduct = async (e) => {
    e.preventDefault();
    let downloadUrl;

    // push image to storage
    if (product.image) {
      downloadUrl = await saveFile("images/", product.image);
    }

    // update user in database with new image downloadURL
    const uid = user.uid;
    updateUser(uid, {
      products: [
        ...user.products.filter((p) => p.id !== id),
        {
          ...product,
          image: downloadUrl !== undefined ? downloadUrl : product.image,
        },
      ],
    });

    // alert user of success
    alert(`Product: ${product.name || id} successfully updated `);
  };

  return (
    <div className="grid grid-cols-5 gap-4 h-screen">
      <div className="border-r border-gray-300 p-4 flex flex-col items-start">
        <div className="flex items-center w-full mb-12">
          <div
            onClick={() => router.push("/dashboard")}
            className="text-gray-400 rounded-md p-2 hover:bg-gray-100 cursor-pointer"
          >
            <FaChevronLeft />
          </div>
          <h1 className="font-bold text-lg ml-1">Create Product</h1>
        </div>

        {/* Inputs */}
        <form
          className="w-full space-y-6 border-b"
          onSubmit={(e) => saveProduct(e)}
        >
          {/* Form Group */}
          <div className="flex flex-col w-full">
            <label className="text-gray-400 text-sm mb-0.5" htmlFor="name">
              Name
            </label>

            <input
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              value={product?.name}
              className="border p-1.5 border-gray-300 w-full rounded-md"
              placeholder="My Product"
              id="name"
              type="text"
            />
          </div>

          {/* Form Group */}
          <div className="flex flex-col w-full">
            <label className="text-gray-400 text-sm mb-0.5" htmlFor="name">
              Description
            </label>
            <textarea
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              value={product?.description}
              className="border p-1.5 border-gray-300 w-full h-28 rounded-md"
              placeholder="Product Description"
              id="name"
            />
          </div>

          {/* Form Group */}
          <div className="flex flex-col w-full">
            <label className="text-gray-400 text-sm mb-0.5" htmlFor="name">
              Product Image (wide)
            </label>
            <input
              type="file"
              defaultValue={product?.image}
              onChange={(event) => {
                setProduct({ ...product, image: event.target.files[0] });
              }}
            />
          </div>

          {/* Form Group */}
          {/* <div className="flex flex-col w-full">
            <label className="text-gray-400 text-sm mb-0.5" htmlFor="name">
              Upload Product
            </label>
            <UploadWidget id="name" />
          </div> */}

          {/* Form Group */}
          {/* <div className="flex flex-col w-full">
            <label className="text-gray-400 text-sm mb-0.5" htmlFor="name">
              Price
            </label>
            <div className="flex items-center">
              <div className="flex items-center justify-center py-1.5 px-3 rounded-l-md border-gray-300 border-l border-t border-b">
                $
              </div>
              <input
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
                value={product?.price}
                className="border p-1.5 border-gray-300 w-full rounded-r-md"
                placeholder="5"
                id="name"
                type="number"
                step="0.01"
              />
            </div>
          </div> */}

          {/* Form Group */}

          <div className="flex flex-col w-full">
            <label className="text-gray-400 text-sm mb-0.5" htmlFor="name">
              Product URL
            </label>
            <input
              onChange={(e) => setProduct({ ...product, url: e.target.value })}
              value={product?.url}
              className="border p-1.5 border-gray-300 w-full rounded-md"
              placeholder="https://linktoproduct.com"
              id="name"
              type="url"
            />
          </div>
          <button
            className="bg-black text-white rounded-md w-full p-2 hover:bg-gray-800"
            type="submit"
          >
            Save Product
          </button>
        </form>
      </div>

      {/* Product Page Template */}

      <div className="col-span-3">
        <div className="w-full py-2 px-4 border-b border-gray-300 flex justify-between items-center">
          <p>Preview Mode</p>
          <button
            className="p-1 border-2 border-blue-400 hover:bg-blue-50 rounded-md text-sm text-blue-400 flex items-center"
            onClick={() => {
              navigator.clipboard.writeText(
                `https://usematrice.co/product/${user.displayName.replace(
                  " ",
                  "."
                )}?id=${id}`
              );
            }}
          >
            Copy Link
            <FaLink className="ml-1" />
          </button>
        </div>
        <div className="px-4 py-8">
          {product?.image && (
            <>
              <img
                className="w-full h-64 rounded-md mb-4 object-cover"
                src={
                  typeof product?.image == "object"
                    ? URL.createObjectURL(product?.image)
                    : product?.image
                }
                alt="Product Image"
              />
              <hr className="my-4" />
            </>
          )}
          <h1 className="text-3xl font-bold mb-8">{product?.name}</h1>
          <p className="my-6">{product?.description}</p>
        </div>
      </div>

      <div className="co-span-1 border-l border-gray-300 bg-gray-100 p-4">
        <h1 className="font-bold text-lg">Checkout</h1>
        <p className="mt-2">Purchase this item to receive a download link.</p>
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold">Total:</p>
          <p className="font-bold text-2xl">
            Free
            {/* {product?.price && product?.price !== "0"
              ? product?.price.includes(".")
                ? "$" + product?.price
                : "$" + product?.price + ".00"
              : "Free"} */}
          </p>
        </div>
        {/* Purchase (bottom) */}
        <div className="space-y-2 mt-4">
          <input
            type="email"
            className="border p-1.5 border-gray-300 w-full rounded-md"
            placeholder="email@example.com"
            disabled={true}
          />
          <button className="bg-black text-white rounded-md px-4 py-2 hover:bg-gray-900">
            Purchase now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;

export async function getServerSideProps(context) {
  // get the id of the current item before passing it into create component
  const { id } = context.query;

  return {
    props: {
      id: id,
    },
  };
}
