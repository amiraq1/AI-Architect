import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // basePath: '/AI-Architect', // Uncomment if deploying to github.io/AI-Architect
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
