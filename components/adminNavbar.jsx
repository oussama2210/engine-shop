"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { MdCategory } from "react-icons/md";
import {
    FaBagShopping,
    FaTable,
    FaRegUser,
    FaGear,
    FaStore,
    FaUpload,
    FaPlus,
} from "react-icons/fa6";
import Link from "next/link";
import Logo from "./Logo";

const navItems = [
    { name: "Dashboard", icon: FaTable, href: "/admin" },
    { name: "Orders", icon: FaBagShopping, href: "/admin/orders" },
    { name: "Products", icon: FaStore, href: "/admin/products" },
    { name: "Add Product", icon: FaPlus, href: "/admin/add-proudect" },
    { name: "Bulk Upload", icon: FaUpload, href: "/admin/bulk-upload" },
    { name: "Categories", icon: MdCategory, href: "/admin/categories" },
    { name: "Users", icon: FaRegUser, href: "/admin/users" },
    { name: "Settings", icon: FaGear, href: "/admin/settings" },
];

const AdminNavbar = () => {
    const pathname = usePathname();
    const { user } = useUser();

    const isActive = (href) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <aside className="h-screen w-64 bg-white border-r border-gray-100 flex flex-col pt-6 sticky top-0 shadow-sm shrink-0">
            <div className="px-6 mb-8 flex items-center justify-center">
                <Logo />
            </div>

            <div className="px-6 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin Panel
            </div>

            <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link key={item.name} href={item.href}>
                            <div
                                className={`flex items-center gap-x-3 w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                                    active
                                        ? "bg-[#2a5b46] text-white"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-[#2a5b46]"
                                }`}
                            >
                                <item.icon className="text-[17px] shrink-0" />
                                <span>{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                    <p className="text-xs text-gray-400">Logged in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate mt-0.5">
                        {user?.emailAddresses?.[0]?.emailAddress ?? "Admin"}
                    </p>
                    <div className="mt-2 flex justify-center">
                        <UserButton />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminNavbar;
