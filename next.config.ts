import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
      },
      {
        protocol: "https",
        hostname: "www.minecraft.net",
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "a.c-dn.net",
      },
      {
        protocol: "https",
        hostname: "flagsapi.com",
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'dash.mccapes.net',
          },
        ],
        destination: 'https://mccapes.net/admin/:path*',
        permanent: true, // or false if you want a 307 instead of 308/301
      },
    ];
  },
};

export default nextConfig;
