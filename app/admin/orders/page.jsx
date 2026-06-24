const orders = [
    { id: "#ORD-001", customer: "Alice Martin", email: "alice@example.com", product: "Wireless Headphones Pro", qty: 1, status: "Delivered", amount: 59.99, date: "Apr 5, 2026" },
    { id: "#ORD-002", customer: "Bob Chen", email: "bob@example.com", product: "Smart Speaker Mini", qty: 2, status: "Pending", amount: 79.98, date: "Apr 5, 2026" },
    { id: "#ORD-003", customer: "Sara Kim", email: "sara@example.com", product: "USB-C Fast Charger", qty: 1, status: "Shipped", amount: 24.99, date: "Apr 4, 2026" },
    { id: "#ORD-004", customer: "James Doe", email: "james@example.com", product: "Wireless Headphones Pro", qty: 1, status: "Cancelled", amount: 59.99, date: "Apr 3, 2026" },
    { id: "#ORD-005", customer: "Lena Müller", email: "lena@example.com", product: "Smart Speaker Mini", qty: 1, status: "Delivered", amount: 39.99, date: "Apr 2, 2026" },
    { id: "#ORD-006", customer: "Omar Farsi", email: "omar@example.com", product: "USB-C Fast Charger", qty: 3, status: "Pending", amount: 74.97, date: "Apr 1, 2026" },
];

const statusColors = {
    Delivered: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Shipped: "bg-blue-50 text-blue-700",
    Cancelled: "bg-red-50 text-red-600",
};

export const metadata = { title: "Orders — ShopCart Admin" };

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-sm text-gray-500 mt-1">{orders.length} orders total</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2a5b46]/30">
                        <option>All statuses</option>
                        <option>Pending</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Qty</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{order.customer}</p>
                                        <p className="text-xs text-gray-400">{order.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{order.product}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.qty}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        ${order.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
