import Container from "@/components/Container";

export const metadata = { title: "Blog — ShopCart" };

export default function BlogPage() {
    return (
        <main className="flex-1">
            <Container>
                <div className="py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
                    <p className="text-gray-500">Articles and updates coming soon.</p>
                </div>
            </Container>
        </main>
    );
}
