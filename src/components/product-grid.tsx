import ProductCard from "@/components/product-card";
import { ProductDTO } from "@/schemas/product";

type Props = {
  products: ProductDTO[];
};

export default function ProductGrid({ products }: Props) {
  // products.map((product) => {
  //   console.log(`product:${product.name}`);
  // });
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 3} />
      ))}
    </div>
  );
}
