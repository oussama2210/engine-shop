import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";

const HomeBanner = () => {
    return (
        <div className="py-16 md:py-0 bg-[#fdf0f0] rounded-lg px-10 lg:px-24 flex items-center justify-between min-h-[320px]">
            <div className="space-y-5">
                <Title>
                    Grab Upto 50% off on <br />
                    Selected headphone
                </Title>
                <Link
                    href="/shop"
                    className="inline-block bg-[#2a5b46]/90 text-white/90 px-5 py-2 rounded-md text-sm font-semibold hover:text-white hover:bg-[#2a5b46] transition-colors"
                >
                    Buy Now
                </Link>
            </div>
            <div className="hidden md:flex items-center justify-center w-96 h-64 bg-white/40 rounded-xl text-gray-300 text-sm">
                {/* Add your banner image to /public/banner_1.png */}
            </div>
        </div>
    );
};

export default HomeBanner;
