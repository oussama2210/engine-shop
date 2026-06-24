import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

const ProductPage = ({ product }) => {
    return (
        <div className="flex flex-col md:flex-row gap-8 p-6">
            <div className="relative w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-gray-50">
                <Image
                    src={product?.image}
                    alt={product?.name || "Product image"}
                    fill
                    className="object-contain p-6"
                />
            </div>
            <div className="flex flex-col gap-4 md:w-1/2">
                <p className="text-xl font-bold text-gray-900">{product?.name}</p>
                <p className="text-2xl font-semibold text-[#2a5b46]">
                    ${product?.price?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{product?.description}</p>
                <div className="flex flex-col gap-2 mt-4">
                    <Button className="rounded-full bg-[#2a5b46] text-white hover:bg-[#1e4433]">
                        Add to Cart
                    </Button>
                    <Button variant="outline" asChild className="rounded-full">
                        <Link href="/checkout">Buy Now</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
