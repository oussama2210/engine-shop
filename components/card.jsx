import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Generic product card — lightweight wrapper around a product object.
 * For the full interactive version with ratings/stock/badges use Cart.
 */
export default function Card({ product }) {
    if (!product) return null;

    const stock = product.stock || 0;
    const isLowStock = stock > 0 && stock <= 10;
    const isOutOfStock = stock === 0;

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md relative">
            {/* Stock Badge */}
            {isOutOfStock && (
                <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    Out of Stock
                </div>
            )}
            {isLowStock && !isOutOfStock && (
                <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    Low Stock
                </div>
            )}

            <Link
                href={`/product/${product.id}`}
                className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gray-50 p-4"
            >
                <Image
                    src={product.image}
                    alt={product.title || product.name}
                    fill
                    className={`object-contain p-4 transition-transform duration-300 hover:scale-105 ${isOutOfStock ? 'opacity-50' : ''}`}
                />
            </Link>
            <div className="flex flex-col gap-1 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {product.category}
                </p>
                <Link href={`/product/${product.id}`}>
                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 hover:text-[#2a5b46]">
                        {product.title || product.name}
                    </h3>
                </Link>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-base font-bold text-gray-900">
                        ${product.price?.toFixed(2)}
                    </p>
                    <p className={`text-xs font-semibold ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-green-600'}`}>
                        {isOutOfStock ? 'Awaiting Stock' : `${stock} in stock`}
                    </p>
                </div>
            </div>
        </div>
    );
}
