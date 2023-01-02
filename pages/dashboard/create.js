import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaMagento } from "react-icons/fa";
import { useRouter } from "next/router";
import UploadWidget from "../../components/UploadWidget";
import { getUser, updateUser } from "../../utils/db";
import { deleteFile, getFile, saveFile } from "../../utils/storage";

const Create = ({ id }) => {
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);

  const router = useRouter();

  // TODO: fix bug with this useEffect -> ID is correct but the product info is pulled from another product
  // RECREATE: create a new product in dashboard -> multiple products are created with the same ID with differnet info (look at console.log)
  // changes other product IDs to the new product ID... makes no sense
  useEffect(() => {
    // retrieve product information from database
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user = getUser(user.uid)
        .then((user) => {
          console.log(user);
          const product = user.products.filter((p) => (p.id = id))[0];

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
    console.log(product.image);
    let downloadUrl;

    // push image to storage
    if (product.image) {
      downloadUrl = await saveFile("images/", product.image);
    }

    // update user in database with new image downloadURL
    const uid = user.uid;
    updateUser(uid, {
      products: [
        ...user.products,
        {
          ...product,
          image: downloadUrl !== undefined ? downloadUrl : product.image,
        },
      ],
    });

    // alert user of success
    alert(`Product: ${id} succesfully updated `);
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
              placeholder="My product does amazing things and will make your life easier"
              id="name"
            />
          </div>

          {/* Form Group */}
          <div className="flex flex-col w-full">
            <label className="text-gray-400 text-sm mb-0.5" htmlFor="name">
              Product Image
            </label>
            <input
              type="file"
              defaultValue={product?.image}
              onChange={(event) =>
                setProduct({ ...product, image: event.target.files[0] })
              }
            />
          </div>

          {/* Form Group */}
          <div className="flex flex-col w-full">
            <label className="text-gray-400 text-sm mb-0.5" htmlFor="name">
              Upload Product
            </label>
            <UploadWidget id="name" />
          </div>

          {/* Form Group */}
          <div className="flex flex-col w-full">
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
              />
            </div>
          </div>

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

      <div className="col-span-3 px-4 py-8">
        {product?.image && (
          <>
            <img
              className="w-full h-64 rounded-md mb-4 object-cover"
              src={product?.image}
              alt="Product Image"
            />
            <hr className="my-4" />
          </>
        )}
        <h1 className="text-3xl font-bold mb-8">{product?.name}</h1>
        <p className="my-6">{product?.description}</p>
      </div>

      <div className="co-span-1 border-l border-gray-300 bg-gray-100 p-4">
        <h1 className="font-bold text-lg">Checkout</h1>
        <p className="mt-2">Purchase this item to receive a download link.</p>
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold">Total:</p>
          <p className="font-bold text-2xl">
            {product?.price && product?.price !== "0"
              ? product?.price.includes(".")
                ? "$" + product?.price
                : "$" + product?.price + ".00"
              : "Free"}
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
