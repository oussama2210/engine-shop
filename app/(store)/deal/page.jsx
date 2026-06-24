import Container from "@/components/Container";

export const metadata = { title: "Hot Deals — ShopCart" };

export default function DealPage() {
    return (
        <main className="flex-1">
            <Container>
                <div className="py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Hot Deals</h1>
                    <p className="text-gray-500">Limited-time offers coming soon.</p>
                </div>
            </Container>
        </main>
    );
}
