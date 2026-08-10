import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent iframing (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer policy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Permissions policy — disable sensitive APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS (only sent over HTTPS in production)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Basic CSP — allow self + Google Fonts + WhatsApp assets
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js needs these
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    formats: ["image/webp", "image/avif"],
  },
  experimental: {},
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
