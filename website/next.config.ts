import type { NextConfig } from "next";
import path from "path";

const isProduction = process.env.NODE_ENV === 'production';
const isCloudflare = process.env.DEPLOY_TARGET === 'cloudflare';

const githubPagesBasePath = '/augmented-coding-patterns';
const basePath = isCloudflare ? '' : (isProduction ? githubPagesBasePath : '');

const nextConfig: NextConfig = {
  output: isProduction ? 'export' : undefined,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
