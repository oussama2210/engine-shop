import React from "react";
import Link from "next/link";
import { categoriesData } from "@/constant/data";
import { 
    Smartphone, 
    Tv, 
    Laptop, 
    Wind, 
    WashingMachine, 
    CookingPot,
    Cable
} from "lucide-react";

const categoryIcons = {
    "Mobiles": Smartphone,
    "Appliances": Tv,
    "Smartphones": Smartphone,
    "Air Conditioners": Wind,
    "Washing Machine": WashingMachine,
    "Kitchen Appliances": CookingPot,
    "Gadget Accessories": Cable,
};

export default async function CategoriesPage() {
    "use cache";
    
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Shop by Category</h1>
                    <p className="mt-2 text-gray-600">Browse our wide range of product categories</p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoriesData.map((category) => {
                        const Icon = categoryIcons[category.title] || Laptop;
                        
                        return (
                            <Link
                                key={category.href}
                                href={`/shop?category=${category.href}`}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#2a5b46]/10 flex items-center justify-center mb-4 group-hover:bg-[#2a5b46]/20 transition-colors">
                                    <Icon className="w-8 h-8 text-[#2a5b46]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2a5b46] transition-colors">
                                    {category.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Explore {category.title.toLowerCase()}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                {/* Featured Categories */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            href="/shop?category=smartphones"
                            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white hover:scale-[1.02] transition-transform"
                        >
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">Smartphones</h3>
                                <p className="text-blue-100 mb-4">Latest models with cutting-edge technology</p>
                                <span className="inline-block bg-white text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    Shop Now →
                                </span>
                            </div>
                            <Smartphone className="absolute right-8 bottom-8 w-32 h-32 opacity-20" />
                        </Link>

                        <Link
                            href="/shop?category=gadget-accessories"
                            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white hover:scale-[1.02] transition-transform"
                        >
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">Gadget Accessories</h3>
                                <p className="text-emerald-100 mb-4">Essential accessories for your devices</p>
                                <span className="inline-block bg-white text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    Shop Now →
                                </span>
                            </div>
                            <Cable className="absolute right-8 bottom-8 w-32 h-32 opacity-20" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
