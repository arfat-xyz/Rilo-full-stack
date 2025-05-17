import ProductClientComponent from "@/components/products/products-client-component";
import { metaDataGeneratorForNormalPage } from "@/hoook/generate-meta";
import Image from "next/image";

export const metadata = metaDataGeneratorForNormalPage("Home");
export default function Home() {
  return <ProductClientComponent />;
}
