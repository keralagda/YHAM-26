import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'ham.org.in' },
    ],
  },
  allowedDevOrigins: [
    "preview-chat-5f4208bf-dc63-471b-afce-360a8cd5f8c6.space-z.ai",
  ],
};

export default nextConfig;
