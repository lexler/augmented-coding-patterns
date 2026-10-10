#!/usr/bin/env bash
set -euo pipefail

from_caller() {
  [[ $1 == /* ]] && echo "$1" || echo "$PWD/$1"
}

arguments=()
while (($#)); do
  case $1 in
    --file)
      (($# >= 2)) && [[ $2 != -* ]] || { echo "usage: $0 --file <path>" >&2; exit 2; }
      arguments+=(--file "$(from_caller "$2")"); shift 2 ;;
    --file=*) arguments+=(--file "$(from_caller "${1#--file=}")"); shift ;;
    *) arguments+=("$1"); shift ;;
  esac
done

cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)/website"
exec habit-hooks ${arguments[@]+"${arguments[@]}"}
