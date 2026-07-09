import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const backendOrigin =
  process.env.NEXT_PUBLIC_API_ORIGIN ||
  process.env.API_ORIGIN ||
  "http://localhost:5000";

const nextConfig = {
  poweredByHeader: false,
  compress: true,
  // Avoid wrong workspace root on shared hosting with multiple lockfiles
  outputFileTracingRoot: __dirname,
  // Limit parallel workers — shared cPanel often hits EAGAIN / EPERM on spawn
  experimental: {
    cpus: 1,
    workerThreads: false
  },
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
