import Container from "@/components/Container";
import ProductPage from "@/components/proudectPage";
import OrderForm from "@/components/order";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/api-client";
import { sampleProducts } from "@/constant/data";

export async function generateMetadata({ params }) {
    const { id } = await params;
    let product = sampleProducts.find((p) => p.id === id);
    try {
        const data = await getProduct(id);
        if (data?.name) product = { title: data.name, ...data };
    } catch {}
    return {
        title: product ? `${product.title || product.name} — ShopCart` : "Product Not Found",
    };
}

export default async function ProductDetailPage({ params }) {
    const { id } = await params;

    let product = sampleProducts.find((p) => p.id === id);
    let stock = product?.stock || 0;

    try {
        const data = await getProduct(id);
        if (data) {
            product = {
                id: data.id,
                title: data.name,
                image: data.images?.[0] || product?.image || "",
                price: data.price,
                stock: data.stock,
                description: data.description || product?.description || "",
                category: data.category?.name || product?.category || "",
                rating: product?.rating || 0,
                reviews: product?.reviews || 0,
            };
            stock = data.stock;
        }
    } catch {}

    if (!product) {
        notFound();
    }

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
                            description: product.description || `High-quality ${product.category} product.`,
                        }}
                    />

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
                        <OrderForm />
                    </div>
                </div>
            </Container>
        </main>
    );
}
