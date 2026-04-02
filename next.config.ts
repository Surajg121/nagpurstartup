import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Notion uploaded files (signed S3 URLs, various regions)
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      // Notion hosted images / attachments
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "notion.so",
      },
      // Notion file hosting (prod-files-secure domain)
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
