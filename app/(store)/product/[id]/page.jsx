import Container from "@/components/Container";
import ProductPage from "@/components/proudectPage";
import OrderForm from "@/components/order";
import { sampleProducts } from "@/constant/data";
import { notFound } from "next/next";
import { InventoryService } from '@/lib/inventory';
export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = sampleProducts.find((p) => p.id === id);
    return {
        title: product ? `${product.title} — ShopCart` : "Product Not Found",
    };
}

export const revalidate = 300; // Cache for 5 minutes (300 seconds)

export default async function ProductDetailPage({ params }) {
    
    
    const { id } = await params;
    const product = sampleProducts.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    const stock = await InventoryService.getStock(id) || 0;
    const isLowStock = stock > 0 && stock <= 10;
    const isOutOfStock = stock === 0;

    return (
        <main className="flex-1">
            <Container>
                <div className="py-12 space-y-12">
                    <ProductPage
                        product={{
                            image: product.image,
                            name: product.title,
                            price: product.price,
                            stock: product.stock,
                            description: `High-quality ${product.category} product. Rated ${product.rating}/5 by ${product.reviews} customers.`,
                        }}
                    />
                    
                    {/* Stock Status */}
                    <div className="max-w-2xl mx-auto">
                        <div className={`p-4 rounded-xl border-2 ${
                            isOutOfStock ? 'bg-red-50 border-red-200' :
                            isLowStock ? 'bg-amber-50 border-amber-200' :
                            'bg-green-50 border-green-200'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`font-semibold ${
                                        isOutOfStock ? 'text-red-700' :
                                        isLowStock ? 'text-amber-700' :
                                        'text-green-700'
                                    }`}>
                                        {isOutOfStock ? 'Out of Stock - Awaiting Restock' :
                                         isLowStock ? `Only ${stock} left in stock!` :
                                         'In Stock'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {isOutOfStock ? 'We will notify you when this item is back in stock' :
                                         isLowStock ? 'Order soon before it runs out' :
                                         `${stock} units available`}
                                    </p>
                                </div>
                                <div className={`text-2xl font-bold ${
                                    isOutOfStock ? 'text-red-600' :
                                    isLowStock ? 'text-amber-600' :
                                    'text-green-600'
                                }`}>
                                    {stock}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <OrderForm disabled={isOutOfStock} />
                    </div>
                </div>
            </Container>
        </main>
    );
}
