import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import UploadWidget from "../../components/UploadWidget";

const Create = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);

  const router = useRouter();

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
        <div className="w-full space-y-6 border-b">
          {/* Form Group */}
          <div className="flex flex-col w-full">
            <label className="text-gray-400 text-sm mb-0.5" htmlFor="name">
              Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
              className="border p-1.5 border-gray-300 w-full h-28 rounded-md"
              placeholder="My product does amazing things and will make your life easier"
              id="name"
              type="text"
            />
          </div>

          {/* Form Group */}
          <div className="flex flex-col w-full">
            <label className="text-gray-400 text-sm mb-0.5" htmlFor="name">
              Product Image
            </label>
            <input
              type="file"
              onChange={(event) => {
                console.log(event.target.files[0]);
                setImage(event.target.files[0]);
              }}
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
                onChange={(e) => setPrice(e.target.value)}
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
              URL
            </label>
            <div className="flex items-center">
              <div className="flex items-center justify-center py-1.5 px-3 rounded-l-md border-gray-300 border-l border-t border-b bg-gray-100">
                matrice.com/
              </div>
              <input
                onChange={(e) => setUrl(e.target.value)}
                className="border p-1.5 border-gray-300 w-full rounded-r-md"
                placeholder="productName"
                id="name"
                type="text"
              />
            </div>
          </div>
          <button
            className="bg-black text-white rounded-md w-full p-2 hover:bg-gray-800"
            type="submit"
          >
            Save Product
          </button>
        </div>
      </div>

      {/* Product Page Template */}

      <div className="col-span-3 px-4 py-8">
        {image && (
          <img
            className="w-full h-64 rounded-md mb-4"
            src={URL.createObjectURL(image)}
            alt="Product Image"
          />
        )}
        <h1 className="text-3xl font-bold mb-8">{name}</h1>
        <p className="my-6">{description}</p>
      </div>

      <div className="co-span-1 border-l border-gray-300 bg-gray-100 p-4">
        <h1 className="font-bold text-lg">Checkout</h1>
        <p className="mt-2">Purchase this item to receive a download link.</p>
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold">Total:</p>
          <p className="font-bold text-2xl">
            {price.includes(".") ? "$" + price : "$" + price + ".00"}
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
