/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// module.exports = nextConfig

module.exports = {
  images: {
    domains: ['pbs.twimg.com', 'images.nature.com'],
  },
  nextConfig
  // 他の設定...
};