import React, { useEffect, useState } from "react";
import { getUserByDisplayName } from "../../utils/db";
import { useRouter } from "next/router";

const User = ({ id }) => {
  const [product, setProduct] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    let productId = router.query.id;
    // retrieve product information from database
    let user = getUserByDisplayName(router.query.user.replace(".", " "))
      .then((user) => {
        const product = user.products.filter((p) => p.id === productId);
        setProduct(product[0]);
      })
      .catch((err) => console.error(err));
  }, [router.isReady]);

  return (
    <div className="flex w-full h-full">
      <div className="p-8 w-full">
        {product?.image && (
          <>
            <img
              className="w-full h-64 rounded-md mb-4 object-cover"
              src={URL.createObjectURL(product?.image)}
              alt="Product Image"
            />
            <hr className="my-4" />
          </>
        )}

        <h1 className="text-3xl font-bold mb-8">{product?.name}</h1>
        <p className="my-6">{product?.description}</p>
      </div>

      {/* checkout */}
      <div className="co-span-1 border-l border-gray-300 bg-gray-100 p-4 w-128">
        <h1 className="font-bold text-lg">Checkout</h1>
        <p className="mt-2">Purchase this item to receive a download link.</p>
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold">Total:</p>
          <p className="font-bold text-2xl">
            {product?.price?.includes(".")
              ? "$" + product?.price
              : "$" + product?.price + ".00"}
          </p>
        </div>
        {/* Purchase (bottom) */}
        <div className="space-y-2 mt-4">
          <input
            type="email"
            className="border p-1.5 border-gray-300 w-full rounded-md"
            placeholder="email@example.com"
          />
          <button className="bg-black text-white rounded-md px-4 py-2 hover:bg-gray-900">
            Purchase now
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
