import ProductClientComponent from "@/components/products/products-client-component";
import { metaDataGeneratorForNormalPage } from "@/hoook/generate-meta";
import React from "react";

export const metadata = metaDataGeneratorForNormalPage("All Products");
const ProductsPage = () => {
  return <ProductClientComponent />;
};

export default ProductsPage;
