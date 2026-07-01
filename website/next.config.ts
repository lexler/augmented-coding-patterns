import type { NextConfig } from "next";
import path from "path";

const isProduction = process.env.NODE_ENV === 'production';
const isCloudflare = process.env.DEPLOY_TARGET === 'cloudflare';

const githubPagesBasePath = '/augmented-coding-patterns';

const nextConfig: NextConfig = {
  output: isProduction ? 'export' : undefined,
  basePath: isCloudflare ? '' : (isProduction ? githubPagesBasePath : ''),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
