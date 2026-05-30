import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  images: {
    unoptimized: true,
  },

  webpack: (config, { dev }) => {
    if (!dev) config.cache = false;
    return config;
  },
};

export default withMDX(nextConfig);