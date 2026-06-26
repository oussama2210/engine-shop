"use client";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { productType, categoriesData } from "@/constant/data";
import { FaUpload, FaTrash, FaSpinner, FaCheck } from "react-icons/fa6";

export default function AddProductPage() {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    buyPrice: "",
    price: "",
    originalPrice: "",
    category: "",
    type: "",
    stock: "",
    description: "",
    imageUrl: "",
    isSale: false,
    isHot: false,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      setUploadError(err.message);
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    setUploadError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.title,
          buyPrice: form.buyPrice ? parseFloat(form.buyPrice) : null,
          price: parseFloat(form.price),
          salePrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
          category: form.category,
          stock: parseInt(form.stock) || 0,
          description: form.description,
          image: form.imageUrl,
          featured: form.isHot,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save product");
      }

      alert("Product saved successfully!");
      setForm({
        title: "",
        buyPrice: "",
        price: "",
        originalPrice: "",
        category: "",
        type: "",
        stock: "",
        description: "",
        imageUrl: "",
        isSale: false,
        isHot: false,
      });
      setPreview(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to list a new product.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
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

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Product Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          {preview ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors shadow-sm"
              >
                <FaTrash className="text-xs" />
              </button>
              {form.imageUrl && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                  <FaCheck className="text-[10px]" />
                  Uploaded to Supabase
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-[#2a5b46]">
                  <FaSpinner className="text-2xl animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <FaUpload className="text-2xl" />
                  <span className="text-sm">Click to upload or drag & drop</span>
                  <span className="text-xs">PNG, JPG, WebP, GIF up to 5MB</span>
                </div>
              )}
            </div>
          )}
          {uploadError && (
            <p className="text-xs text-red-500 mt-1">{uploadError}</p>
          )}
        </div>

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
            disabled={submitting}
            className="rounded-full bg-[#2a5b46] text-white hover:bg-[#1e4433] px-8 disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Product"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full px-8"
            onClick={() => {
              setForm({ title: "", buyPrice: "", price: "", originalPrice: "", category: "", type: "", stock: "", description: "", imageUrl: "", isSale: false, isHot: false });
              setPreview(null);
              setUploadError("");
            }}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}
