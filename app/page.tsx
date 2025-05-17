import ProductClientComponent from "@/components/products/products-client-component";
import { metaDataGeneratorForNormalPage } from "@/hoook/generate-meta";

export const metadata = metaDataGeneratorForNormalPage("Home");
export default function Home() {
  return <ProductClientComponent />;
}
