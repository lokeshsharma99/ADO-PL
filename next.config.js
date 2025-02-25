/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    // Don't run TypeScript during production builds - we should catch these during development
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // Don't run ESLint during production builds - we should catch these during development
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
}

module.exports = nextConfig 