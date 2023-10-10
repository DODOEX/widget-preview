const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // 严格模式下 useEffect 会运行两次
  reactStrictMode: false,

  experimental: {
    appDir: true,
    typedRoutes: true,
    esmExternals: "loose", // required to make Konva & react-konva work
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "https://developer.dodoex.io",
        permanent: false,
      },
    ];
  },

  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src *; frame-ancestors *",
          },
        ],
      },
    ];
  },

  webpack: (
    config
    // { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    // Fixes npm packages that depend on `fs` module, for example: lowdb
    config.resolve.fallback = {
      fs: false,
      // ----- for @shopify/web-worker
      net: false,
      crypto: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
      stream: false,
      tls: false,
      // ----- for @shopify/web-worker
    };

    // https://react-svgr.com/docs/next/#nextjs
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );
    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              // https://github.com/svg/svgo#default-preset
              svgoConfig: {
                plugins: [
                  "removeTitle",
                  "removeXMLNS",
                  "mergePaths",
                  // {
                  //   name: 'preset-default',
                  //   params: {
                  //     overrides: {
                  //       // removeTitle: false,
                  //       // https://github.com/svg/svgo#svg-wont-scale-when-css-is-applied-on-it
                  //       removeViewBox: false,
                  //     },
                  //   },
                  // },
                ],
              },
            },
          },
        ],
      }
    );
    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    // ----- for @shopify/web-worker
    // Perform customizations to webpack config
    config.output.globalObject = "self";
    // ----- for @shopify/web-worker

    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work

    // Important: return the modified config
    return config;
  },
};

/**
 * @type {import('next').NextConfig}
 * next-compose-plugins 缺少维护不再使用，使用 [reduce](https://github.com/hashicorp/next-mdx-enhanced/issues/18#issuecomment-859167393) 的方式应用不同插件
 * @see https://dev.to/krzysztofzuraw/migrating-nextjs-plugins-from-next-compose-plugins-2gnl
 */
module.exports = () => {
  const plugins = [withBundleAnalyzer];
  return plugins.reduce((acc, next) => {
    return next(acc);
  }, nextConfig);
};
