import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaPlus,
  FaChartPie,
  FaBriefcase,
  FaTrash,
  FaLink,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { getUser, updateUser, deleteProduct } from "../../utils/db";
import { arrayUnion } from "firebase/firestore";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user = getUser(user.uid)
        .then((user) => {
          setUser(user);
        })
        .catch((err) => console.error("ERROR FETCHING USER: ", err));
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const removeProduct = (id) => {
    const product = user.products.filter((p) => p.id === id)[0];

    const deletedProduct = {
      id: id,
      name: product.name,
      description: product.description,
      price: product.price || "0",
      url: product.url || "",
      image: product.image || "",
      file: "",
    };

    // Delete the product from the database
    deleteProduct(user.uid, deletedProduct);

    // Remove the product from the state
    setUser({
      ...user,
      products: user.products.filter((p) => p.id !== id),
    });
  };

  const addProduct = () => {
    const newProduct = {
      id: Math.random().toString(36).substring(2, 10),
      name: "",
      description: "",
      price: "",
      url: "",
      image: "",
      file: "",
    };

    updateUser(user.uid, {
      products: arrayUnion(newProduct),
    });

    router.push(`/dashboard/create?id=${newProduct.id}`);
  };

  return (
    <div className="grid grid-cols-5 gap-4 h-full">
      {/* SideBar */}
      <div className="border-r border-gray-300 p-4 flex flex-col items-start justify-between h-full">
        <div className="w-full">
          <h1 className="font-bold text-lg mb-12">Dashboard</h1>

          <div className="w-full space-y-2">
            <button className="flex w-full items-center text-gray-400 hover:bg-gray-50 rounded-md cursor-pointer p-2">
              <FaHome className="mr-2" /> Home
            </button>
            <button className="flex w-full items-center text-gray-400 hover:bg-gray-50 rounded-md cursor-pointer p-2">
              <FaChartPie className="mr-2" /> Analytics (soon)
            </button>
          </div>
        </div>
      </div>

      {/* Product Overview section */}
      <div className="col-span-4 p-4">
        <h1 className="text-3xl font-bold mb-12">Your Products</h1>
        {/* Map over all products */}
        {user?.products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between w-1/2  hover:bg-gray-50 rounded-md cursor-pointer p-2"
          >
            <a
              href={`/dashboard/create?id=${product.id}`}
              className="w-full felx"
            >
              <button className="flex items-center justify-between w-1/2  hover:bg-gray-50 rounded-md cursor-pointer">
                <div className="flex items-center">
                  <FaBriefcase className="mr-2" />
                  {product.name || "Unnamed Product"}
                </div>
              </button>
            </a>
            <div className="flex space-x-2">
              <FaLink
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://usematrice.co/product/${user.displayName.replace(
                      " ",
                      "."
                    )}?id=${product.id}`
                  );
                }}
                className="rounded-md hover:bg-gray-200 h-full p-0.5"
              />
              <FaTrash
                onClick={() => removeProduct(product.id)}
                className="rounded-md hover:bg-gray-200 h-full p-0.5"
              />
            </div>
          </div>
        ))}
        <p onClick={addProduct}>
          <button className="flex items-center w-1/2 text-gray-400 hover:bg-gray-50 rounded-md cursor-pointer p-2">
            <FaPlus className="mr-2" /> Add new Product
          </button>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
