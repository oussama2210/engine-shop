const users = [
    { id: 1, name: "Alice Martin", email: "alice@example.com", role: "Customer", orders: 5, joined: "Jan 12, 2026" },
    { id: 2, name: "Bob Chen", email: "bob@example.com", role: "Customer", orders: 2, joined: "Feb 3, 2026" },
    { id: 3, name: "Sara Kim", email: "sara@example.com", role: "Customer", orders: 8, joined: "Dec 20, 2025" },
    { id: 4, name: "James Doe", email: "james@example.com", role: "Admin", orders: 0, joined: "Nov 1, 2025" },
    { id: 5, name: "Lena Müller", email: "lena@example.com", role: "Customer", orders: 3, joined: "Mar 15, 2026" },
];

export const metadata = { title: "Users — ShopCart Admin" };

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <p className="text-sm text-gray-500 mt-1">{users.length} registered users</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Orders</th>
                                <th className="px-6 py-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#2a5b46]/10 flex items-center justify-center text-[#2a5b46] font-bold text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            user.role === "Admin"
                                                ? "bg-purple-50 text-purple-700"
                                                : "bg-gray-100 text-gray-600"
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{user.orders}</td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">{user.joined}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
