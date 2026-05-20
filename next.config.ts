import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-5f4208bf-dc63-471b-afce-360a8cd5f8c6.space-z.ai",
  ],
};

export default nextConfig;
