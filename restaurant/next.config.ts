import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};


module.exports = nextConfig;

export default nextConfig;
