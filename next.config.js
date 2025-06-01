/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {

    formats: ['image/avif', 'image/webp'], // pour de meilleures perfs
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
