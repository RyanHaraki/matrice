import React from "react";
import { FaHome, FaChartPie } from "react-icons/fa";

const DashboardNavbar = () => {
  return (
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
  );
};

export default DashboardNavbar;
