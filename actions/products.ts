"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Comment, Product, Role } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

const PRODUCTS_TAG = "products";
export async function getProducts({
  skip = 0,
  take = 10,
}: {
  skip?: number;
  take?: number;
} = {}) {
  const [products, count] = await Promise.all([
    db.product.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.product.count(),
  ]);

  return { products, count };
}
export async function createProduct(
  formData: Pick<Product, "name" | "description" | "price" | "images" | "stock">
) {
  const data = await auth();
  if (data?.user?.role !== Role.ADMIN) {
    throw new Error("You're not authorized");
  }
  const createProduct = await db.product.create({
    data: {
      ...formData,
      userId: data?.user?.id as string,
    },
  });
  // revalidatePath("/prodcuts");
  revalidatePath("/dashboard");
  revalidateTag(PRODUCTS_TAG);
  return createProduct;
}
export async function updateProduct(
  formData: Pick<
    Product,
    "name" | "description" | "price" | "images" | "stock" | "id"
  >
) {
  console.log({ formData });
  const data = await auth();
  if (data?.user?.role !== Role.ADMIN) {
    throw new Error("You're not authorized");
  }
  const exist = await db.product.count({ where: { id: formData.id } });
  if (!exist) {
    throw new Error("Product not found");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...others } = formData;
  const udpatedData = await db.product.update({
    where: { id: formData?.id },
    data: { ...others, userId: data?.user?.id as string },
  });
  // revalidatePath("/prodcuts");
  revalidatePath("/dashboard");
  revalidateTag(PRODUCTS_TAG);
  return udpatedData;
}

export const getSingleProduct = (id: string) => {
  return db.product.findUnique({
    where: { id },
  });
};

export const getAllComments = (id: string) => {
  return db.comment.findMany({
    where: {
      productId: id,
    },
    include: {
      user: true,
    },
  });
};

export const postComment = async (
  formData: Pick<Comment, "content" | "productId" | "rating">
) => {
  const data = await auth();
  if (!data?.user?.role) {
    throw new Error("You're not authorized");
  }
  console.log(formData);
  const createComment = await db.comment.create({
    data: {
      content: formData.content,
      productId: formData.productId,
      rating: parseInt(formData.rating as unknown as string),
      userId: data?.user?.id,
    },
  });
  return createComment;
};
