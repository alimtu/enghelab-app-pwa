/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  // Pin file tracing to this project; the server has a stray lockfile in the
  // parent dir, which made Next infer the wrong workspace root.
  outputFileTracingRoot: __dirname,
  experimental: {
    staleTimes: {
      dynamic: 0,
      // Next 16 requires static >= 30; 30 is the lowest allowed.
      static: 30,
    },
  },
  // Was `experimental.turbo`, which Next 16 rejects. Its former resolveAlias /
  // resolveExtensions were never actually in effect (the key was ignored), so
  // they are dropped rather than promoted: `@/*` already comes from jsconfig.json,
  // and resolveExtensions would override Next's defaults and drop .mjs/.cjs.
  turbopack: {
    // Pin Turbopack's root. A stray package.json/package-lock.json in the home
    // dir makes root inference walk up past this project, which breaks bare
    // imports like `@import 'tailwindcss'` in src/app/globals.css.
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's33.picofile.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'uploadkon.ir',
      },
      {
        protocol: 'http',
        hostname: '212.23.201.81',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gtechme.com',
      },
      {
        protocol: 'https',
        hostname: 'back-dev.itcuir.ir',
      },
      {
        protocol: 'https',
        hostname: 'back-base.itcuir.ir',
      },
      {
        protocol: 'https',
        hostname: 'back-product.itcuir.ir',
      },
      {
        protocol: 'https',
        hostname: 'crane.feham.ir',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    unoptimized: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
