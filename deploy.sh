#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$project_root/website"

DEPLOY_TARGET=cloudflare npm run build

npx wrangler pages deploy out --project-name augmented-coding-patterns --branch main
