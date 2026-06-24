"use client";
import React, { useState } from "react";
import {
    FaBagShopping,
    FaStore,
    FaRegUser,
    FaArrowTrendUp,
} from "react-icons/fa6";
import Link from "next/link";

const stats = [
    {
        label: "Total Revenue",
        value: "$12,430",
        change: "+14% this month",
        icon: FaArrowTrendUp,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        label: "Total Orders",
        value: "284",
        change: "+8 today",
        icon: FaBagShopping,
        color: "bg-blue-50 text-blue-600",
    },
    {
        label: "Products",
        value: "62",
        change: "3 low stock",
        icon: FaStore,
        color: "bg-amber-50 text-amber-600",
    },
    {
        label: "Customers",
        value: "1,204",
        change: "+23 this week",
        icon: FaRegUser,
        color: "bg-purple-50 text-purple-600",
    },
];

const initialOrders = [
    { id: "#ORD-001", customer: "Alice Martin", product: "Wireless Headphones Pro", status: "Delivered", amount: "$59.99", date: "Apr 5, 2026", stock: 10 },
    { id: "#ORD-002", customer: "Bob Chen", product: "Smart Speaker Mini", status: "Pending", amount: "$39.99", date: "Apr 5, 2026", stock: 25 },
    { id: "#ORD-003", customer: "Sara Kim", product: "USB-C Fast Charger", status: "Shipped", amount: "$24.99", date: "Apr 4, 2026", stock: 50 },
    { id: "#ORD-004", customer: "James Doe", product: "Wireless Headphones Pro", status: "Cancelled", amount: "$59.99", date: "Apr 3, 2026", stock: 10 },
    { id: "#ORD-005", customer: "Lena Müller", product: "Smart Speaker Mini", status: "Processing", amount: "$39.99", date: "Apr 2, 2026", stock: 25 },
];

const statusColors = {
    Delivered: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Processing: "bg-blue-50 text-blue-700",
    Shipped: "bg-indigo-50 text-indigo-700",
    Cancelled: "bg-red-50 text-red-600",
};

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminDashboard() {
    const [orders, setOrders] = useState(initialOrders);
    const [editingOrderId, setEditingOrderId] = useState(null);

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        setEditingOrderId(null);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4"
                    >
                        <div className={`p-3 rounded-xl ${s.color}`}>
                            <s.icon className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {s.label}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-0.5">{s.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{s.change}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Recent Orders</h2>
                    <Link
                        href="/admin/orders"
                        className="text-xs font-semibold text-[#2a5b46] hover:underline"
                    >
                        View all
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                                <th className="px-6 py-3">Order</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Stock</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.customer}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.product}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold ${
                                            order.stock === 0 ? 'text-red-600' : 
                                            order.stock <= 10 ? 'text-amber-600' : 
                                            'text-green-600'
                                        }`}>
                                            {order.stock === 0 ? 'Awaiting' : `${order.stock} units`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingOrderId === order.id ? (
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                onBlur={() => setEditingOrderId(null)}
                                                className="px-2.5 py-1 rounded-full text-xs font-semibold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2a5b46]"
                                                autoFocus
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <button
                                                onClick={() => setEditingOrderId(order.id)}
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]} hover:opacity-80 transition-opacity`}
                                            >
                                                {order.status}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">{order.amount}</td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/admin/add-proudect" className="bg-[#2a5b46] text-white rounded-2xl p-5 hover:bg-[#1e4433] transition-colors">
                    <p className="font-semibold">Add New Product</p>
                    <p className="text-sm text-white/70 mt-1">List a new item in the store</p>
                </Link>
                <Link href="/admin/products" className="bg-white border border-gray-100 rounded-2xl p-5 hover:bg-gray-50 transition-colors">
                    <p className="font-semibold text-gray-900">Manage Products</p>
                    <p className="text-sm text-gray-400 mt-1">Edit, delete or restock</p>
                </Link>
                <Link href="/admin/orders" className="bg-white border border-gray-100 rounded-2xl p-5 hover:bg-gray-50 transition-colors">
                    <p className="font-semibold text-gray-900">View Orders</p>
                    <p className="text-sm text-gray-400 mt-1">Track and update order status</p>
                </Link>
            </div>
        </div>
    );
}
