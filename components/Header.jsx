"use client";
import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./navbar";
import SearchBar from "./search";
import Link from "next/link";
import { ShoppingBag, Heart, User } from "lucide-react";

const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <Container>
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Logo />

                    {/* Navigation */}
                    <HeaderMenu />

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <SearchBar />
                        <Link
                            href="/cart"
                            className="relative text-gray-600 hover:text-shop_light_green hoverEffect"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 bg-shop_light_green text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                0
                            </span>
                        </Link>
                        <Link
                            href="/wishlist"
                            className="text-gray-600 hover:text-shop_light_green hoverEffect hidden sm:inline-flex"
                        >
                            <Heart className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/sign-in"
                            className="text-sm font-semibold text-gray-700 hover:text-shop_light_green hoverEffect flex items-center gap-1"
                        >
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Login</span>
                        </Link>
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default Header;
