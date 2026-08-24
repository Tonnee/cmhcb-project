import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent webpack from bundling native binary modules used in Route Handlers.
  // Without this, production builds crash at runtime even though compilation succeeds.
  serverExternalPackages: ["sharp", "@prisma/client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
