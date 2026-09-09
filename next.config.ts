import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  images: {
    qualities: [75, 92],
  },
};

export default nextConfig;
