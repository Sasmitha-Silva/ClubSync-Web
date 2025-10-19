import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "api.dicebear.com",
      "images.unsplash.com",
      "res.cloudinary.com",
    ],
  },
  experimental: {
    dynamicIO: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
