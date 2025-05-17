"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Product, Role } from "@prisma/client"; // Make sure to import your Role enum
import { useState } from "react";
import EditProductForm from "../dashboard/edit-product-fomr";
import DeleteProductModal from "../dashboard/delete-product";

export default function SingleCardComponent({
  product,
  onSuccess,
  isItDashboard,
}: {
  product: Product;
  onSuccess: () => Promise<void>;
  isItDashboard?: boolean;
}) {
  const { data: session } = useSession();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Admin Edit Button (only shows for admins) */}

      {/* Product Image */}
      <div className="relative h-48 w-full">
        <Image
          src={product.images[0] || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <div className="flex items-center mt-2">
          <span className="text-gray-900 font-bold text-xl">
            ${product.price.toFixed(2)}
          </span>
          {product.stock > 0 ? (
            <span className="ml-2 text-green-600 text-sm">
              In Stock ({product.stock})
            </span>
          ) : (
            <span className="ml-2 text-red-600 text-sm">Out of Stock</span>
          )}
        </div>

        {/* Comments and Action Button */}
        <div className="flex justify-between items-center mt-4">
          <EditProductForm
            onSuccess={onSuccess}
            product={product}
            isEditProductModalOpen={showEdit}
            toggleEditProductModal={() => setShowEdit((prev) => !prev)}
          />
          <DeleteProductModal
            onSuccess={onSuccess}
            isDeleteModalOpen={showDelete}
            productId={product?.id}
            toggleDeleteModal={() => setShowDelete((prev) => !prev)}
          />
          <div className="flex space-x-2">
            {session?.user?.role === Role.ADMIN && isItDashboard ? (
              <>
                <button
                  onClick={() => setShowEdit(true)}
                  className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Delete
                </button>
              </>
            ) : (
              <></>
            )}
            <Link
              href={`/products/${product.id}`}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
