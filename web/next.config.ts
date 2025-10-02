import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: '/api/:path',
      destination: 'http://localhost:3000/api/:path',
    },
  ],
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
