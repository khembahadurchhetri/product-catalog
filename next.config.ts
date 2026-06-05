import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // @ts-ignore - Prevents TypeScript from turning this line red if your Next.js type definitions are outdated
  allowedDevOrigins: [
    "192.168.1.74", 
    "192.168.192.1", 
    "localhost:3000", 
    "localhost:3001"
  ],
};

export default nextConfig;