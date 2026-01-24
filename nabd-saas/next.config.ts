import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // ⚡ PERFORMANCE: Enable Gzip/Brotli compression
  compress: true,
  // 🛡️ SECURITY: Remove X-Powered-By header (Obscurity)
  poweredByHeader: false,

  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 🛡️ SECURITY: Add Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN' // Prevents Clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Prevents MIME Sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()' // Principle of Least Privilege
          }
        ]
      }
    ]
  }
};

export default nextConfig;
