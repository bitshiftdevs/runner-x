import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "play.google.com",
        pathname: "/intl/**",
      },
    ],
  },
};

export default nextConfig;
