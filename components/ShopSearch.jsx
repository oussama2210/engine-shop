"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export default function ShopSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    const category = searchParams.get("category");
    if (category) params.set("category", category);
    if (value.trim()) params.set("search", value.trim());
    const qs = params.toString();
    router.push(`/shop${qs ? `?${qs}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a5b46] focus:border-transparent bg-white"
      />
    </form>
  );
}
