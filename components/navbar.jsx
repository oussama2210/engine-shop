"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { headerData } from "@/constant/data";
import SearchBar from "./search";

export default function Navbar() {
    const pathname = usePathname();
    const { totalItems, setIsOpen } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isSignedIn } = useAuth();

    return (
        <header className="sticky top-0 z-30 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                {/* Logo */}
                <Logo />

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                    {headerData.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative py-1 transition-colors hover:text-[#2a5b46] ${
                                pathname === item.href ? "text-[#2a5b46]" : ""
                            }`}
                        >
                            {item.title}
                            {pathname === item.href && (
                                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-[#2a5b46]" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:block">
                        <SearchBar />
                    </div>

                    {/* Auth controls */}
                    <div className="hidden sm:flex items-center gap-2">
                        {isSignedIn ? (
                            <UserButton />
                        ) : (
                            <>
                                <SignInButton>
                                    <button className="text-sm font-semibold text-gray-600 hover:text-[#2a5b46] transition-colors">
                                        Login
                                    </button>
                                </SignInButton>
                                <SignUpButton>
                                    <button className="text-sm font-semibold bg-[#2a5b46] text-white px-3 py-1.5 rounded-md hover:bg-[#1e4433] transition-colors">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </>
                        )}
                    </div>

                    {/* Cart button */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Open cart"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {totalItems > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#2a5b46] text-[10px] font-bold text-white">
                                {totalItems > 9 ? "9+" : totalItems}
                            </span>
                        )}
                    </button>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        className="flex md:hidden h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="border-t border-gray-100 bg-white md:hidden">
                    <nav className="flex flex-col px-4 py-3 gap-1">
                        {headerData.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                                    pathname === item.href
                                        ? "bg-[#2a5b46]/10 text-[#2a5b46]"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {item.title}
                            </Link>
                        ))}
                        {/* Mobile auth controls */}
                        {isSignedIn ? (
                            <div className="px-3 py-2.5 border-t border-gray-100 mt-2 pt-3">
                                <UserButton />
                            </div>
                        ) : (
                            <div className="flex gap-2 px-3 py-2.5 border-t border-gray-100 mt-2 pt-3">
                                <SignInButton>
                                    <button className="flex-1 text-center text-sm font-semibold text-gray-600 hover:text-[#2a5b46] py-2">
                                        Login
                                    </button>
                                </SignInButton>
                                <SignUpButton>
                                    <button className="flex-1 text-center text-sm font-semibold bg-[#2a5b46] text-white px-3 py-2 rounded-md hover:bg-[#1e4433]">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
