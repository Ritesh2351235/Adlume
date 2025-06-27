/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'img.clerk.com'],
  },
  serverExternalPackages: ['@prisma/client'],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;