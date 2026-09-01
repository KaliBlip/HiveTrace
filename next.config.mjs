/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '172.20.10.7',
    '172.20.10.7:3000',
    'localhost:3000',
    '127.0.0.1:3000',
    '*.local',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
      allowedOrigins: [
        '172.20.10.7:3000',
        'localhost:3000',
        '127.0.0.1:3000',
      ],
    },
  },
}

export default nextConfig
