import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A stray lockfile in the home directory made Next guess the wrong workspace
  // root and warn on every build. Pin it to this repository.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
