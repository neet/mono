import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/api/:path",
      destination: "http://localhost:3000/api/:path",
    },
  ],
  experimental: {
    viewTransition: true,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
