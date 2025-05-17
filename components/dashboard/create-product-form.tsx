"use client";
import useProductModal from "@/zustand/products";
import { useRef, useEffect } from "react";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProduct } from "@/actions/products";
import { Product } from "@prisma/client";
import { frontendErrorResponse } from "@/lib/front-end-response";

// Assuming you have a Product type defined somewhere like:
// type Product = {
//   name: string;
//   description?: string;
//   price: number;
//   images: string[];
//   stock: number;
// };

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  images: z
    .array(z.string().url("Must be a valid URL"))
    .min(1, "At least one image is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

// Use Pick to select only the fields we need from Product
type ProductFormValues = Pick<
  Product,
  "name" | "description" | "price" | "images" | "stock"
>;

const CreateProductForm = ({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) => {
  const { isCreateProductModalOpen, toggleCreateProductModal } =
    useProductModal();
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: "arfat",
      description: "asdfasdfasdfasdf",
      price: 66,
      images: [
        "https://m.media-amazon.com/images/I/71UnL+fUeWL._AC_SL1500_.jpg",
      ],
      stock: 55,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images" as never, // No longer needs 'as const' since we're using Pick
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await createProduct(data);
      onSuccess();
      reset();
      toggleCreateProductModal();
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
        toggleCreateProductModal();
      }
    };

    if (isCreateProductModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateProductModalOpen, toggleCreateProductModal]);

  if (!isCreateProductModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40">
      <div
        ref={modalRef}
        className="max-w-lg bg-white w-full rounded-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Create New Product</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name*
            </label>
            <input
              id="name"
              {...register("name")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
          </div>

          {/* Price Field */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price*
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Images Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Image URLs*
              </label>
              <button
                type="button"
                onClick={() => append("")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Image
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                  <input
                    {...register(`images.${index}`)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    placeholder="https://example.com/image.jpg"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.images && (
              <p className="mt-1 text-sm text-red-600">
                {errors.images.message}
              </p>
            )}
          </div>

          {/* Stock Field */}
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Quantity
            </label>
            <input
              id="stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">
                {errors.stock.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={toggleCreateProductModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductForm;
