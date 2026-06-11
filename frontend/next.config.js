/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: process.env.R2_PUBLIC_DOMAIN?.replace(/^https?:\/\//, '') || 'assets.example.com', pathname: '/**' }] },
  experimental: { serverActions: true },
};
module.exports = nextConfig;
