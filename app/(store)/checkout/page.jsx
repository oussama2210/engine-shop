import Container from "@/components/Container";
import OrderForm from "@/components/order";
import { SubTitle, SubText } from "@/components/ui/text";

export const metadata = { title: "Checkout — ShopCart" };

export default function CheckoutPage() {
    return (
        <main className="flex-1">
            <Container>
                <div className="py-12 max-w-lg mx-auto">
                    <div className="mb-8 text-center">
                        <SubTitle className="text-2xl mb-2">Checkout</SubTitle>
                        <SubText>Complete your purchase by filling in your details below.</SubText>
                    </div>
                    <OrderForm />
                </div>
            </Container>
        </main>
    );
}
