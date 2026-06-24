import AdminNavbar from "@/components/adminNavbar";

export const metadata = { title: "Admin — ShopCart" };

export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <AdminNavbar />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
