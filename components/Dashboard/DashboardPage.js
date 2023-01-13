import React from "react";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { updateUser, deleteProduct } from "../../utils/db";
import { arrayUnion } from "firebase/firestore";
import Product from "./Product";

const DashboardPage = ({ userData }) => {
  const [user, setUser] = useState(userData);

  const router = useRouter();

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  const removeProduct = (id) => {
    const product = user.products.filter((p) => p.id === id)[0];

    const deletedProduct = {
      id: id,
      name: product.name,
      description: product.description,
      price: "Free",
      url: product.url || "",
      image: product.image || "",
      buyers: product.buyers || [],
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
      price: "Free",
      url: "",
      image: "",
      buyers: [],
      file: "",
    };

    updateUser(user.uid, {
      products: arrayUnion(newProduct),
    });

    router.push(`/dashboard/create?id=${newProduct.id}`);
  };

  return (
    <div className="col-span-4 p-4">
      <h1 className="text-3xl font-bold mb-12">Your Products</h1>
      {/* Map over all products */}
      {user?.products.map((product) => (
        <Product
          product={product}
          user={userData}
          removeProduct={removeProduct}
        />
      ))}
      <p onClick={addProduct}>
        <button className="flex items-center w-1/2 text-gray-400 hover:bg-gray-50 rounded-md cursor-pointer p-2">
          <FaPlus className="mr-2" /> Add new Product
        </button>
      </p>
    </div>
  );
};

export default DashboardPage;
