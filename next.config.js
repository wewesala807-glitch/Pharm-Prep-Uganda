const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^\/(subjects|topics|dashboard)\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "pharmaprep-pages",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
      },
    },
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "pharmaprep-images",
        expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
};

module.exports = withPWA(nextConfig);
