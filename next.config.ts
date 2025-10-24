import type { NextConfig } from "next";
import "./src/data/env/server";

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
