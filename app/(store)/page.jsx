import React from "react";
import Container from "@/components/Container";
import HomeBanner from "@/components/homebaneer";
import Cart from "@/components/cart";
import { sampleProducts } from "@/constant/data";
import { SubTitle } from "@/components/ui/text";
import { InventoryService } from 'lib/inventory';
export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <Container>
        <div className="pt-8 pb-12">
          <HomeBanner />
        </div>
      </Container>

      {/* Featured Products */}
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
            {sampleProducts.map((product) => (
              <Cart key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
