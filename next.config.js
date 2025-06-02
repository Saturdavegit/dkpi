/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kefirpourines.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/public/img/**',
      },
    ],
  },
  env: {
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Permet le CORS, mais à utiliser prudemment si pas nécessaire partout
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          // Protection minimale contre le clickjacking (à adapter selon ton cas)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
