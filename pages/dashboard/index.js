import React, { useState, useEffect } from "react";
import { FaHome, FaPlus, FaChartPie, FaRegStar } from "react-icons/fa";
import { useRouter } from "next/router";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    } else {
      router.push("/");
    }
  }, []);

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

      {/*Main Area*/}
      <div className="col-span-4 p-4">
        <h1 className="text-3xl font-bold mb-12">Your Products</h1>
        <a href="/dashboard/create">
          <button className="flex items-center w-1/2 text-gray-400 hover:bg-gray-50 rounded-md cursor-pointer p-2">
            <FaPlus className="mr-2" /> Add new Product
          </button>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
