"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";

export default function CartPage() {
    const { items, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <main className="flex-1">
                <Container>
                    <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
                        <ShoppingBag className="h-16 w-16 text-gray-200" />
                        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
                        <p className="text-sm text-gray-400">Looks like you haven&apos;t added anything yet.</p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 rounded-full bg-[#2a5b46] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1e4433] transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </Container>
            </main>
        );
    }

    return (
        <main className="flex-1 bg-gray-50">
            <Container>
                <div className="py-10">
                    <div className="flex items-center gap-3 mb-8">
                        <Link href="/shop" className="text-gray-400 hover:text-gray-700 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Shopping Cart
                            <span className="ml-2 text-base font-normal text-gray-400">({totalItems} items)</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items list */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                                >
                                    {/* Image */}
                                    <Link
                                        href={`/product/${item.id}`}
                                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </Link>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col gap-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            {item.category}
                                        </p>
                                        <Link href={`/product/${item.id}`}>
                                            <h3 className="text-sm font-semibold text-gray-900 hover:text-[#2a5b46] transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm font-bold text-[#2a5b46] mt-1">
                                            ${item.price.toFixed(2)} each
                                        </p>

                                        {/* Qty + remove */}
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-gray-900">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="text-base font-bold text-gray-900">
                                                    ${(item.price * item.qty).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Clear cart */}
                            <div className="flex justify-end">
                                <button
                                    onClick={clearCart}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors underline-offset-2 hover:underline"
                                >
                                    Clear cart
                                </button>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6 space-y-4">
                                <h2 className="font-semibold text-gray-900 text-base">Order Summary</h2>

                                <div className="space-y-2 text-sm">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-gray-500">
                                            <span className="line-clamp-1 flex-1 pr-2">{item.title} ×{item.qty}</span>
                                            <span className="font-medium text-gray-700 shrink-0">
                                                ${(item.price * item.qty).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-700">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Shipping</span>
                                        <span className="font-medium text-emerald-600">Free</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>

                                <Link href="/checkout">
                                    <Button className="w-full rounded-full bg-[#2a5b46] text-white hover:bg-[#1e4433] py-3 font-semibold">
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                <Link
                                    href="/shop"
                                    className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}
