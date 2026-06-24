"use client";
import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { SubTitle, SubText } from './ui/text';

export default function OrderForm({ proudect }) {
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="mb-6">
        <SubTitle className="text-xl mb-1">Shipping Details</SubTitle>
        <SubText>Please enter your details to complete the order.</SubText>
      </div>

      <form className="space-y-4 flex flex-col" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <Input id="name" placeholder="John Doe" required className="h-10" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="address" className="text-sm font-medium text-gray-700">
            Delivery Address
          </label>
          <Input id="address" placeholder="123 Main St, City, Country" required className="h-10" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
            Quantity
          </label>
          <Input id="quantity" type="number" min="1" defaultValue="1" required className="h-10" />
        </div>

        <div className="pt-4 mt-2 border-t border-gray-100">
          <Button
            className="w-full bg-[#2a5b46] hover:bg-[#1e4433] text-white py-5 rounded-full text-base font-semibold shadow-sm transition-all"
            type="submit"
          >
            Buy Now
          </Button>
        </div>
      </form>
    </div>
  );
}
