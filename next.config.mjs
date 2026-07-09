/** @type {import('next').NextConfig} */
const backendOrigin =
  process.env.NEXT_PUBLIC_API_ORIGIN ||
  process.env.API_ORIGIN ||
  "http://localhost:5000";

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
        destination: `${backendOrigin}/api/:path*`
      },
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`
      }
    ];
  }
};

export default nextConfig;
