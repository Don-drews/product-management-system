import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatar
      { protocol: "https", hostname: "cdn.discordapp.com" }, // Discord avatar（将来用）
      { protocol: "https", hostname: "media.discordapp.net" }, // Discordの一部CDN
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
