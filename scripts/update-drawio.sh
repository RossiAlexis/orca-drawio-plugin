#!/usr/bin/env bash
# Replace the bundled draw.io viewer and image libraries with the ones from a draw.io release tag.
# Usage: scripts/update-drawio.sh v29.7.12
set -euo pipefail

tag="${1:?usage: scripts/update-drawio.sh <draw.io tag, e.g. v29.7.12>}"
root="$(cd "$(dirname "$0")/.." && pwd)"
dest="$root/editor/drawio"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

git clone -q --depth 1 --branch "$tag" --filter=blob:none --sparse https://github.com/jgraph/drawio.git "$work/drawio"
git -C "$work/drawio" sparse-checkout set --no-cone \
  '/src/main/webapp/js/viewer-static.min.js' '/src/main/webapp/img/lib/**' '/LICENSE'

rm -rf "$dest/js" "$dest/img"
mkdir -p "$dest/js" "$dest/img"
cp "$work/drawio/src/main/webapp/js/viewer-static.min.js" "$dest/js/"
cp -R "$work/drawio/src/main/webapp/img/lib" "$dest/img/"
cp "$work/drawio/LICENSE" "$dest/LICENSE"
cat > "$dest/SOURCE.txt" <<EOF
draw.io viewer and image libraries from https://github.com/jgraph/drawio
tag $tag, commit $(git -C "$work/drawio" rev-parse HEAD)
src/main/webapp/js/viewer-static.min.js -> js/viewer-static.min.js
src/main/webapp/img/lib/ -> img/lib/
EOF

files=$(find "$root" -type f -not -path '*/.git/*' -not -path '*/.orca/*' | wc -l | tr -d ' ')
echo "Updated to draw.io $tag. Plugin now holds $files files (Orca allows 2000 and 50 MiB)."
echo "Run: orca plugin validate . && orca plugin check . && orca plugin test ."
