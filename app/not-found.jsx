import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-[#2a5b46]">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-[#2a5b46] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1e4433] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
