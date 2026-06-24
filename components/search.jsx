"use client";
import { Search, X } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
            setQuery("");
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Search"
            >
                <Search className="h-4.5 w-4.5" />
            </button>

            {/* Search Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                    <div className="flex min-h-screen items-start justify-center p-4 pt-20">
                        <div 
                            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full py-5 pl-14 pr-14 text-lg border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2a5b46]"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </form>
                            <div className="px-6 pb-4 text-sm text-gray-500">
                                Press Enter to search
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchBar;