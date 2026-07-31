/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@meridian/core", "@meridian/ui", "@meridian/registry"]
};

module.exports = nextConfig;
