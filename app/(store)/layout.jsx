import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function StoreLayout({ children }) {
    return (
        <>
            <Navbar />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
        </>
    );
}
