import React, { useState } from "react";
import Modal from "../UI/Modal";
import { FaBriefcase, FaTrash, FaLink } from "react-icons/fa";

const Product = ({ product, user, removeProduct }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [copyModal, setCopyModal] = useState(false);

  // Modal Contents

  return (
    <div
      key={product.id}
      className="flex items-center justify-between w-1/2  hover:bg-gray-50 rounded-md cursor-pointer p-2"
    >
      {/* Copy Modal */}
      <Modal
        open={copyModal}
        setOpen={setCopyModal}
        message={"Share your product with your customers!"}
        head={"Link copied to clipboard!"}
        type={"confirm"}
        action={() => setCopyModal(false)}
      />
      {/* Delete Modal */}
      <Modal
        open={deleteModal}
        setOpen={setDeleteModal}
        message={
          "Are you sure you want to delete this product? This action cannot be undone."
        }
        head={"Delete Product"}
        type={"delete"}
        action={() => removeProduct(product.id)}
      />

      <a href={`/dashboard/create?id=${product.id}`} className="w-full felx">
        <button className="flex items-center justify-between w-3/4  hover:bg-gray-50 rounded-md cursor-pointer">
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
            setCopyModal(true);
          }}
          className="rounded-md hover:bg-gray-200 h-full p-0.5"
        />
        <FaTrash
          onClick={() => setDeleteModal(true)}
          className="rounded-md hover:bg-gray-200 h-full p-0.5"
        />
      </div>
    </div>
  );
};

export default Product;
