import Container from "@/components/Container";
import ProductCard from "@/components/card";
import ShopSearch from "@/components/ShopSearch";
import { getProducts } from "@/lib/api-client";
import { filterProducts } from "@/lib/search";
import { sampleProducts } from "@/constant/data";

export const metadata = { title: "Shop — ShopCart" };

export default async function ShopPage({ searchParams }) {
    const params = await searchParams;
    const search = params?.search || "";
    const category = params?.category || "";

    let filteredProducts = sampleProducts;

    try {
        const data = await getProducts({ search, category, limit: 50 });
        if (data?.products?.length > 0) {
            filteredProducts = data.products.map((p) => ({
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

    if (!filteredProducts.length && (search || category)) {
        filteredProducts = filterProducts(sampleProducts, { search, category });
    }

    return (
        <main className="flex-1">
            <Container>
                <div className="py-12">
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
                            {search && (
                                <p className="text-gray-500">
                                    Search results for &quot;{search}&quot; ({filteredProducts.length} products)
                                </p>
                            )}
                            {category && !search && (
                                <p className="text-gray-500">
                                    Category: {category.replace(/-/g, ' ')} ({filteredProducts.length} products)
                                </p>
                            )}
                            {!search && !category && (
                                <p className="text-gray-500">Browse all products ({filteredProducts.length} items)</p>
                            )}
                        </div>
                        <ShopSearch />
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg mb-4">No products found</p>
                            <a href="/shop" className="text-[#2a5b46] hover:underline font-semibold">
                                View all products
                            </a>
                        </div>
                    )}
                </div>
            </Container>
        </main>
    );
}
