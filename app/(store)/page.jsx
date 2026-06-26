import React from "react";
import Container from "@/components/Container";
import HomeBanner from "@/components/homebaneer";
import ProductCard from "@/components/card";
import { SubTitle } from "@/components/ui/text";
import { getProducts } from "@/lib/api-client";
import { sampleProducts } from "@/constant/data";

export default async function Home() {
  let products = sampleProducts;

  try {
    const data = await getProducts({ featured: "true", limit: 10 });
    if (data?.products?.length > 0) {
      products = data.products.map((p) => ({
        id: p.id,
        title: p.name,
        category: p.category?.name || "",
        price: p.price,
        stock: p.stock,
        image: p.images?.[0] || "",
        isSale: !!p.salePrice,
        isHot: p.featured,
      }));
    }
  } catch {}

  return (
    <main className="flex flex-col min-h-screen">
      <Container>
        <div className="pt-8 pb-12">
          <HomeBanner />
        </div>
      </Container>

      <Container>
        <div className="pb-16">
          <div className="flex items-center justify-between mb-8">
            <SubTitle className="text-2xl">Featured Products</SubTitle>
            <a
              href="/shop"
              className="text-sm font-semibold text-shop_light_green hover:underline"
            >
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
