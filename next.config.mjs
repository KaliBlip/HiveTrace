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
    'localhost',
    'localhost:3000',
    '127.0.0.1',
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
        '172.20.10.7',
        '172.20.10.7:3000',
        'localhost',
        'localhost:3000',
        '127.0.0.1',
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
