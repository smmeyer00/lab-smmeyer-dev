import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["mini.test", "stevens-mac-mini.tail343306.ts.net"],
  transpilePackages: ["three"],
  images: {
    qualities: [75, 92],
  },
};

export default nextConfig;
