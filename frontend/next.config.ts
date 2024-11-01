/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/json/:path*',
        destination: 'http://localhost:3000/json/:path*',
      },
    ]
  },
}

module.exports = nextConfig