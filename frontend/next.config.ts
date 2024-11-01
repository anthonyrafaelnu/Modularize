/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/json/:path*',
        destination: `http://${process.env.NODE_ENV === "production" ? "backend" : "localhost"}:3000/json/:path*`,
      },
    ]
  },
  output: "standalone"
}

module.exports = nextConfig