/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@meridian/core",
    "@meridian/ui",
    "@meridian/registry",
    "@meridian/engine",
    "@meridian/resolve",
    "@meridian/edge",
    "@meridian/brief",
    "@meridian/council",
    "@meridian/llm"
  ]
};

module.exports = nextConfig;
