import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\\.mdx?$/,
});

const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
