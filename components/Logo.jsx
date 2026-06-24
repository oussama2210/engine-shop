import Link from "next/link";

export default function Logo({ className }) {
  return (
    <Link href="/" className={`text-2xl font-bold tracking-tight text-gray-900 ${className || ''}`}>
      SHOP<span className="text-[#2a5b46]">CART</span>
    </Link>
  );
}
