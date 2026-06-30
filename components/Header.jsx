"use client";
import React from "react";
import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./navbar";
import SearchBar from "./search";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";

const Header = () => {
    const { isSignedIn } = useAuth();

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
                        {isSignedIn ? (
                            <UserButton />
                        ) : (
                            <div className="flex items-center gap-2">
                                <SignInButton>
                                    <button className="text-sm font-semibold text-gray-700 hover:text-shop_light_green hoverEffect">
                                        Login
                                    </button>
                                </SignInButton>
                                <SignUpButton>
                                    <button className="text-sm font-semibold bg-shop_light_green text-white px-3 py-1.5 rounded-md hover:bg-shop_light_green/90 hoverEffect">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default Header;
