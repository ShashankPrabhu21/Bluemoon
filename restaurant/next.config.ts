//next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: false, // ensures Webpack is used for dev too
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  basePath: '', // You can leave this blank if not using a subpath
  assetPrefix: '', // You can leave this blank unless using CDN
  headers: async () => [
    {
      source: "/_next/static/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
      ],
    },
  ],
};

module.exports = nextConfig;

