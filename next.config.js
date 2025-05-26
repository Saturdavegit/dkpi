/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['kefirpourines.s3.eu-north-1.amazonaws.com'],
  },
  env: {
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
  },
}

module.exports = nextConfig 