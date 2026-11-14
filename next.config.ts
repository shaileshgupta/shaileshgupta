import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: { position: "bottom-right" },
  // Book pages read their Markdown with fs; ship it with any server render.
  outputFileTracingIncludes: {
    "/the-third-freedom/**": ["./content/the-third-freedom/**/*.md"],
  },
};

export default nextConfig;
