#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/website"
npm install
npm run build:cloudflare
npm run serve
