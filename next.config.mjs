/** @type {import('next').NextConfig} */
const nextConfig = {
    cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "hgoghugofsfewltjpmpk.supabase.co",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
