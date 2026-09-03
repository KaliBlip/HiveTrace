/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '*.local',
    '*.local:3000',
    '192.168.*',
    '172.20.*',
    '172.*',
    '10.*',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        '*.local',
        '*.local:3000',
        '192.168.*',
        '172.20.*',
        '172.*',
        '10.*',
      ],
    },
  },
}

export default nextConfig
