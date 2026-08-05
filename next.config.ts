import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // El dominio canónico (sin www) para SEO.
  async redirects() {
    return [
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "www.creaconstruye.abdev.click" }],
        destination: "https://creaconstruye.abdev.click/:path",
        permanent: true,
      },
    ];
  },
  // Cabeceras de seguridad que aplican a TODAS las rutas (complementa
  // las de vercel.json — estas van en el HTML response).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;