import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
  allowedDevOrigins: [
    "http://21.0.5.216:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
  ],
};

export default nextConfig;
