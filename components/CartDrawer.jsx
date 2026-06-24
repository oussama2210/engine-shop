"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "./ui/button";

export default function CartDrawer() {
    const { items, isOpen, setIsOpen, removeFromCart, updateQty, totalItems, totalPrice } = useCart();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-[#2a5b46]" />
                        <span className="font-semibold text-gray-900">
                            Cart
                            {totalItems > 0 && (
                                <span className="ml-2 rounded-full bg-[#2a5b46] px-2 py-0.5 text-xs font-bold text-white">
                                    {totalItems}
                                </span>
                            )}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                            <ShoppingBag className="h-12 w-12 text-gray-200" />
                            <p className="text-sm text-gray-400">Your cart is empty</p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-sm font-semibold text-[#2a5b46] hover:underline"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li key={item.id} className="flex gap-4">
                                    {/* Thumbnail */}
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-1 flex-col gap-1">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-gray-400">{item.category}</p>
                                        <p className="text-sm font-bold text-[#2a5b46]">
                                            ${(item.price * item.qty).toFixed(2)}
                                        </p>

                                        {/* Qty controls */}
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                onClick={() => updateQty(item.id, item.qty - 1)}
                                                className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-6 text-center text-sm font-semibold text-gray-900">
                                                {item.qty}
                                            </span>
                                            <button
                                                onClick={() => updateQty(item.id, item.qty + 1)}
                                                className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="self-start text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                        </div>
                        <Link
                            href="/cart"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center rounded-full border border-[#2a5b46] px-4 py-2.5 text-sm font-semibold text-[#2a5b46] hover:bg-[#2a5b46] hover:text-white transition-colors"
                        >
                            View Cart
                        </Link>
                        <Link
                            href="/checkout"
                            onClick={() => setIsOpen(false)}
                        >
                            <Button className="w-full rounded-full bg-[#2a5b46] text-white hover:bg-[#1e4433] text-sm font-semibold py-2.5">
                                Checkout
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
