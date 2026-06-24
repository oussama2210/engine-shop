"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { productType, categoriesData } from "@/constant/data";
import { FaUpload } from "react-icons/fa6";

export default function AddProductPage() {
    const [form, setForm] = useState({
        title: "",
        buyPrice: "",
        price: "",
        originalPrice: "",
        category: "",
        type: "",
        stock: "",
        description: "",
        isSale: false,
        isHot: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("New product:", form);
        alert("Product saved (connect to your API to persist).");
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
                <p className="text-sm text-gray-500 mt-1">Fill in the details to list a new product.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                {/* Title */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Product Title</label>
                    <Input
                        name="title"
                        placeholder="e.g. Wireless Headphones Pro"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Price row */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Buy Price ($)</label>
                        <Input
                            name="buyPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="29.99"
                            value={form.buyPrice}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Price ($)</label>
                        <Input
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="59.99"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Original Price ($) <span className="text-gray-400 font-normal">(optional)</span></label>
                        <Input
                            name="originalPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="89.99"
                            value={form.originalPrice}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Category + Type */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                            className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2a5b46]/30"
                        >
                            <option value="">Select category</option>
                            {categoriesData.map((c) => (
                                <option key={c.href} value={c.href}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2a5b46]/30"
                        >
                            <option value="">Select type</option>
                            {productType.map((t) => (
                                <option key={t.value} value={t.value}>{t.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stock */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Stock</label>
                    <Input
                        name="stock"
                        type="number"
                        min="0"
                        placeholder="50"
                        value={form.stock}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <Textarea
                        name="description"
                        placeholder="Describe the product..."
                        value={form.description}
                        onChange={handleChange}
                        className="min-h-28"
                    />
                </div>

                {/* Image upload placeholder */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Product Image</label>
                    <div className="flex items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                            <FaUpload className="text-2xl" />
                            <span className="text-sm">Click to upload or drag & drop</span>
                            <span className="text-xs">PNG, JPG up to 5MB</span>
                        </div>
                    </div>
                </div>

                {/* Flags */}
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isSale"
                            checked={form.isSale}
                            onChange={handleChange}
                            className="rounded accent-[#2a5b46]"
                        />
                        Mark as Sale
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isHot"
                            checked={form.isHot}
                            onChange={handleChange}
                            className="rounded accent-[#2a5b46]"
                        />
                        Mark as Hot
                    </label>
                </div>

                <div className="pt-2 flex gap-3">
                    <Button
                        type="submit"
                        className="rounded-full bg-[#2a5b46] text-white hover:bg-[#1e4433] px-8"
                    >
                        Save Product
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full px-8"
                        onClick={() => setForm({ title: "", buyPrice: "", price: "", originalPrice: "", category: "", type: "", stock: "", description: "", isSale: false, isHot: false })}
                    >
                        Clear
                    </Button>
                </div>
            </form>
        </div>
    );
}
