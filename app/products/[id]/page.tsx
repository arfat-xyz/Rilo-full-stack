import SingleProductViewComponent from "@/components/products/single-product/single-product-client-component";
import React from "react";

const SingleProductPage = ({ params }: { params: { id: string } }) => {
  return <SingleProductViewComponent id={params?.id} />;
};

export default SingleProductPage;
