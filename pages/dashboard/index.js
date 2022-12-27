import React, { useState, useEffect } from "react";
import { FaHome, FaPlus, FaChartPie, FaBriefcase } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { useRouter } from "next/router";
import { getUser, updateUser } from "../../utils/db";
import { arrayUnion } from "firebase/firestore";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [productId, setProductId] = useState("");
  const router = useRouter();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user = getUser(user.uid)
        .then((user) => {
          setUser(user);
          console.log("1", user);
        })
        .catch((err) => console.error(err));
    } else {
      router.push("/");
    }

    console.log("2", user);
  }, []);

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

    setProductId(id);

    updateUser(user.uid, {
      products: arrayUnion(newProduct),
    });
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
          <a href={`/dashboard/create?id=${product.id}`}>
            <button className="flex items-center w-1/2  hover:bg-gray-50 rounded-md cursor-pointer p-2">
              <FaBriefcase className="mr-2" />
              {product.name || "Unnamed Product"}
            </button>
          </a>
        ))}
        <a href={`/dashboard/create?id=${productId}`}>
          <button
            onClick={addProduct}
            className="flex items-center w-1/2 text-gray-400 hover:bg-gray-50 rounded-md cursor-pointer p-2"
          >
            <FaPlus className="mr-2" /> Add new Product
          </button>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
