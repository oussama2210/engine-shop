import { categoriesData } from "@/constant/data";
import { FaPlus, FaPen, FaTrash } from "react-icons/fa6";

export const metadata = { title: "Categories — ShopCart Admin" };

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">{categoriesData.length} categories</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-[#2a5b46] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#1e4433] transition-colors">
                    <FaPlus className="text-xs" />
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {categoriesData.map((cat) => (
                    <div
                        key={cat.href}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between"
                    >
                        <div>
                            <p className="font-semibold text-gray-900">{cat.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">/{cat.href}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="text-gray-400 hover:text-[#2a5b46] transition-colors" title="Edit">
                                <FaPen className="text-sm" />
                            </button>
                            <button className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                <FaTrash className="text-sm" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
