"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your store configuration.</p>
            </div>

            {/* Store Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-gray-900 text-base border-b border-gray-50 pb-3">Store Info</h2>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Store Name</label>
                    <Input defaultValue="ShopCart" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Store Email</label>
                    <Input type="email" defaultValue="Shopcart@gmail.com" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Store Description</label>
                    <Textarea defaultValue="Discover curated products at ShopCart, blending style and value." className="min-h-24" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <Input defaultValue="New Orleans, USA" />
                </div>
                <Button className="rounded-full bg-[#2a5b46] text-white hover:bg-[#1e4433] px-8">
                    Save Changes
                </Button>
            </div>

            {/* Admin Account */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-gray-900 text-base border-b border-gray-50 pb-3">Admin Account</h2>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Admin Email</label>
                    <Input type="email" defaultValue="admin@shopcart.com" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <Input type="password" placeholder="Leave blank to keep current" />
                </div>
                <Button className="rounded-full bg-[#2a5b46] text-white hover:bg-[#1e4433] px-8">
                    Update Account
                </Button>
            </div>
        </div>
    );
}
