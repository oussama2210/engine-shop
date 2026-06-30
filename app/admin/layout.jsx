"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminNavbar from "@/components/adminNavbar";

export default function AdminLayout({ children }) {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace("/sign-in");
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded || !isSignedIn) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <AdminNavbar />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
