import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Prevent ESLint 9 vs Next 15 flat options conflict from blocking production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep strict TypeScript checking active
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
