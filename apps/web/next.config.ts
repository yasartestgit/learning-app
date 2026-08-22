import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for infra/docker/Dockerfile.web, which copies .next/standalone.
  output: "standalone",
};

export default nextConfig;
