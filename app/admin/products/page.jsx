import Link from "next/link";
import { sampleProducts } from "@/constant/data";
import { FaPlus, FaPen, FaTrash } from "react-icons/fa6";

export const metadata = { title: "Products — ShopCart Admin" };

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">{sampleProducts.length} products listed</p>
                </div>
                <Link
                    href="/admin/add-proudect"
                    className="inline-flex items-center gap-2 bg-[#2a5b46] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#1e4433] transition-colors"
                >
                    <FaPlus className="text-xs" />
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Buy Price</th>
                                <th className="px-6 py-4">Sell Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Badges</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sampleProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{product.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                                    <td className="px-6 py-4">
                                        {product.buyPrice != null ? (
                                            <span className="font-semibold text-gray-900">${product.buyPrice.toFixed(2)}</span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                                        {product.originalPrice && (
                                            <span className="ml-2 text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${product.stock < 10 ? "text-red-500" : "text-gray-900"}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-1.5">
                                        {product.isSale && (
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 font-semibold">Sale</span>
                                        )}
                                        {product.isHot && (
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-orange-50 text-orange-600 font-semibold">Hot</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button className="text-gray-400 hover:text-[#2a5b46] transition-colors" title="Edit">
                                                <FaPen className="text-sm" />
                                            </button>
                                            <button className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
