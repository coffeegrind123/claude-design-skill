#!/usr/bin/env bash
# fetch-images.sh — download full-res Game UI Database screenshots for the agent to Read.
# Static /uploads/ images are NOT Cloudflare-challenged, so plain curl works (no cookies).
#
# Usage:
#   bash fetch-images.sh <outdir-name> <urlfile>      # urlfile = one full-res URL per line
#   bash fetch-images.sh <outdir-name> -              # read URLs from stdin
#   bash fetch-images.sh <outdir-name> url1 url2 ...   # URLs as args
#
# Output dir: /tmp/guidb/<outdir-name>/  (created). Files named NN_<basename>.jpg in input order.
# Prints a manifest (index, local path, bytes, type) — Read each path to view the UI.
set -u
BASE="/tmp/guidb"
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
REFERER="https://www.gameuidatabase.com/"

[ $# -lt 2 ] && { echo "usage: fetch-images.sh <outdir-name> <urlfile|-|url...>"; exit 2; }
OUTNAME="$1"; shift
OUTDIR="$BASE/$OUTNAME"
mkdir -p "$OUTDIR"

# Gather URLs
URLS=()
if [ "$1" = "-" ]; then
  while IFS= read -r line; do [ -n "$line" ] && URLS+=("$line"); done
elif [ -f "$1" ]; then
  while IFS= read -r line; do [ -n "$line" ] && URLS+=("$line"); done < "$1"
else
  for u in "$@"; do URLS+=("$u"); done
fi
[ "${#URLS[@]}" -eq 0 ] && { echo "no URLs given"; exit 2; }

echo "Downloading ${#URLS[@]} image(s) -> $OUTDIR"
i=0; ok=0; bad=0
for url in "${URLS[@]}"; do
  i=$((i+1))
  # normalise relative URLs
  case "$url" in
    http*) full="$url" ;;
    /*)    full="https://www.gameuidatabase.com$url" ;;
    *)     full="https://www.gameuidatabase.com/$url" ;;
  esac
  bn=$(basename "${full%%\?*}")
  out=$(printf '%s/%02d_%s' "$OUTDIR" "$i" "$bn")
  code=$(curl -sS -A "$UA" -e "$REFERER" -o "$out" -w '%{http_code}' --max-time 60 "$full" 2>/dev/null)
  sz=$(wc -c < "$out" 2>/dev/null || echo 0)
  ft=$(file -b "$out" 2>/dev/null | cut -c1-22)
  if [ "$code" = "200" ] && echo "$ft" | grep -qi 'image'; then
    ok=$((ok+1)); printf '  [%02d] OK   %7s bytes  %s  (%s)\n' "$i" "$sz" "$out" "$ft"
  else
    bad=$((bad+1)); printf '  [%02d] FAIL http=%s %s bytes  %s  (%s) <- re-check URL\n' "$i" "$code" "$sz" "$out" "$ft"
  fi
done
echo "Done: $ok ok, $bad failed. Read the OK paths to view the screenshots."
[ "$bad" -gt 0 ] && exit 1 || exit 0
