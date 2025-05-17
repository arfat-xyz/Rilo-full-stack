"use client";
import { useRef, useEffect } from "react";
import { deleteProduct } from "@/actions/products";
import { frontendErrorResponse } from "@/lib/front-end-response";

const DeleteProductModal = ({
  productId,
  isDeleteModalOpen,
  toggleDeleteModal,
  onSuccess,
}: {
  productId: string;
  isDeleteModalOpen: boolean;
  toggleDeleteModal: () => void;
  onSuccess: () => Promise<void>;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      await onSuccess();
      toggleDeleteModal();
    } catch (error) {
      return frontendErrorResponse({ message: (error as Error).message });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        toggleDeleteModal();
      }
    };

    if (isDeleteModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDeleteModalOpen, toggleDeleteModal]);

  if (!isDeleteModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40">
      <div
        ref={modalRef}
        className="max-w-md bg-white w-full rounded-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Delete Product</h2>
        <p className="mb-6">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={toggleDeleteModal}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
