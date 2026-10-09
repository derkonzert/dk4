module.exports = {
  reactStrictMode: true,

  // no next/image usage; disable the /_next/image optimizer endpoint
  images: {
    unoptimized: true,
  },

  i18n: {
    locales: ["en", "de"],
    defaultLocale: "de",
  },

  async redirects() {
    return [
      {
        source: "/account",
        destination: "/account/sign-in",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/webcal/:token.ics",
        destination: "/api/webcal?token=:token",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};
