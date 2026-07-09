/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**"
      },
      {
        protocol: "https",
        hostname: "iis.net.in",
        pathname: "/localconnect/uploads/**"
      }
    ],
    formats: ["image/avif", "image/webp"]
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*"
      },
      {
        source: "/uploads/:path*",
        destination: "http://localhost:5000/uploads/:path*"
      }
    ];
  }
};

export default nextConfig;
