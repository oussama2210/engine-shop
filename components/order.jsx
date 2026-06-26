"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa6";
import Container from "./Container";

export default function OrderForm() {
  const { items, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    notes: "",
    paymentMethod: "card",
  });

  const [step, setStep] = useState("form");
  const [orderId, setOrderId] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, qty: i.qty, price: i.price })),
          shippingAddress: form.address,
          city: form.city,
          postalCode: form.postalCode,
          phone: form.phone,
          paymentMethod: form.paymentMethod,
          notes: form.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      setOrderId(data.order.id);
      setOrderNumber(data.order.orderNumber);
      setStep("processing");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (step !== "processing" || !orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.status === "CONFIRMED" || data.status === "FAILED") {
          setStep(data.status === "CONFIRMED" ? "confirmed" : "failed");
          clearCart();
          clearInterval(interval);
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [step, orderId, clearCart]);

  if (items.length === 0 && step === "form") {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">Your cart is empty</p>
        <p className="text-sm mt-1">Add some products before checking out.</p>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="text-center py-16 space-y-4">
        <FaSpinner className="animate-spin text-4xl text-[#2a5b46] mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Processing Your Order</h2>
        <p className="text-gray-500">Order #{orderNumber}</p>
        <p className="text-sm text-gray-400">Reserving stock and confirming your items...</p>
      </div>
    );
  }

  if (step === "confirmed") {
    return (
      <div className="text-center py-16 space-y-4">
        <FaCheckCircle className="text-5xl text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Order Confirmed!</h2>
        <p className="text-gray-500">Order #{orderNumber}</p>
        <p className="text-sm text-gray-400">You will receive a confirmation shortly.</p>
        <a
          href="/shop"
          className="inline-block mt-4 rounded-full bg-[#2a5b46] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#1e4433] transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  if (step === "failed") {
    return (
      <div className="text-center py-16 space-y-4">
        <FaExclamationCircle className="text-5xl text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Order Failed</h2>
        <p className="text-gray-500">We couldn&apos;t process your order. Some items may be out of stock.</p>
        <button
          onClick={() => { setStep("form"); setOrderId(null); setOrderNumber(null); }}
          className="inline-block mt-4 rounded-full bg-[#2a5b46] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#1e4433] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-lg">Shipping Details</h2>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <Input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Delivery Address</label>
          <Input name="address" placeholder="123 Main St" value={form.address} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">City</label>
            <Input name="city" placeholder="New York" value={form.city} onChange={handleChange} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Postal Code</label>
            <Input name="postalCode" placeholder="10001" value={form.postalCode} onChange={handleChange} required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <Input name="phone" type="tel" placeholder="+1 234 567 890" value={form.phone} onChange={handleChange} required />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Payment Method</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2a5b46]/30"
          >
            <option value="card">Credit Card</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Order Notes (optional)</label>
          <Textarea name="notes" placeholder="Any special instructions..." value={form.notes} onChange={handleChange} className="min-h-20" />
        </div>

        {/* Order summary */}
        <div className="border-t border-gray-100 pt-4 space-y-2">
          <div className="max-h-40 overflow-y-auto space-y-1.5 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-600">
                <span className="line-clamp-1 flex-1">{item.title} × {item.qty}</span>
                <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-50">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[#2a5b46] text-white hover:bg-[#1e4433] py-3 font-semibold disabled:opacity-50"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" />
              Placing Order...
            </span>
          ) : (
            `Place Order — $${totalPrice.toFixed(2)}`
          )}
        </Button>
      </form>
    </div>
  );
}
