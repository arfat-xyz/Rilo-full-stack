"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Product, Role } from "@prisma/client"; // Make sure to import your Role enum
import { useState } from "react";
import EditProductForm from "../dashboard/edit-product-fomr";

export default function SingleCardComponent({
  product,
  onSuccess,
}: {
  product: Product;
  onSuccess: () => Promise<void>;
}) {
  const { data: session } = useSession();
  const [showEdit, setShowEdit] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Admin Edit Button (only shows for admins) */}
      {session?.user?.role === Role.ADMIN && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/admin/products/edit/${product.id}`}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            title="Edit Product"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Link>
        </div>
      )}

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
          <div className="flex space-x-2">
            {session?.user?.role === Role.ADMIN ? (
              <button
                onClick={() => setShowEdit(true)}
                className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Edit
              </button>
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
