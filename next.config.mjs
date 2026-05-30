import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 👈 add this

  pageExtensions: ["ts", "tsx", "md", "mdx"],

  images: {
    unoptimized: true, // already set — required for static export
  },

  webpack: (config, { dev }) => {
    if (!dev) config.cache = false;
    return config;
  },
};

export default withMDX(nextConfig);