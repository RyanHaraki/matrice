import React, { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import UploadWidget from "../../components/UploadWidget";
import { getUser, updateUser } from "../../utils/db";
import { deleteFile, saveFile } from "../../utils/storage";
import { storage } from "../../utils/firebase";

// TODO: get image from database nad set image to said image on page load
const Create = ({ id }) => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // retrieve product information from database
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user = getUser(user.uid)
        .then((user) => {
          setUser(user);
          const product = user.products.filter((p) => (p.id = id));

          // update the state of the application with product information
          setName(product[0].name);
          setDescription(product[0].description);
          setPrice(product[0].price || "0");
          setUrl(product[0].url);
          setImage(product[0].image);
        })
        .catch((err) => console.error(err));
    } else {
      router.push("/");
    }
  }, []);

  // Update product in database
  const updateProduct = () => {
    // create a new prpduct
    const updatedProduct = {
      id: id,
      name: name,
      description: description,
      price: price,
      url: url || "",
      image: image || "",
      file: "",
    };

    // Push the array with the updated product to the database
    let products = user.products;
    const uid = user.uid;
    updateUser(uid, {
      products: products.map((p) => (p.id === id ? (p = updatedProduct) : p)),
    });

    alert(`Product: ${id} succesfully updated`);
  };

  const uploadImage = (img) => {
    console.log(img);
    console.log("name", img.name);

    // Set image in state
    setImage(img);

    // Save image to storage and delete any existing image
    saveFile("/images", img.name);
    if (user.image == img.name) {
      deleteFile(".images", img.name);
    }

    // Update user in database
    updateUser(uid, {
      image: img.name,
    });
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
        <div className="w-full space-y-6 border-b">
          {/* Form Group */}
          <div className="flex flex-col w-full">
            <label className="text-gray-400 text-sm mb-0.5" htmlFor="name">
              Name
            </label>

            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
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
              value={description}
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
              onChange={(event) => uploadImage(event.target.files[0])}
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
                value={price}
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
              <div className="flex items-center justify-center py-1.5 px-3 rounded-l-md border-gray-300 border-l border-t border-b bg-gray-100 text-xs">
                {`usematrice.co/${user?.displayName.replace(" ", ".")}/`}
              </div>
              <input
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                className="border p-1.5 border-gray-300 w-full rounded-r-md"
                placeholder="productName"
                id="name"
                type="text"
              />
            </div>
          </div>
          <button
            className="bg-black text-white rounded-md w-full p-2 hover:bg-gray-800"
            onClick={updateProduct}
          >
            Save Product
          </button>
        </div>
      </div>

      {/* Product Page Template */}

      <div className="col-span-3 px-4 py-8">
        {image && (
          <>
            <img
              className="w-full h-64 rounded-md mb-4 object-cover"
              src={URL.createObjectURL(image)}
              alt="Product Image"
            />
            <hr className="my-4" />
          </>
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

export async function getServerSideProps(context) {
  // get the id of the current item before passing it into create component
  const { id } = context.query;

  return {
    props: {
      id: id,
    },
  };
}
