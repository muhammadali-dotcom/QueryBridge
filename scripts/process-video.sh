#!/usr/bin/env bash
set -euo pipefail

INPUT=$1
OUTPUT=$2
MAX_DURATION=${3:-20}

# Guard: ffmpeg must be in PATH
if ! command -v ffmpeg &>/dev/null; then
  echo "❌ ffmpeg not found. Install via: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)"
  exit 1
fi

# Guard: input file must exist
if [[ ! -f "$INPUT" ]]; then
  echo "❌ Input file not found: $INPUT"
  exit 1
fi

# Create output directory if needed
mkdir -p "$(dirname "$OUTPUT")"

# First conversion attempt with CRF 28
ffmpeg -y -i "$INPUT" \
  -t "$MAX_DURATION" \
  -vf "scale=1280:720,format=yuv420p" \
  -c:v libx264 -crf 28 -preset fast \
  -r 30 \
  -an \
  "$OUTPUT"

# Check output file size (cross-platform)
if [[ "$(uname)" == "Darwin" ]]; then
  SIZE=$(stat -f%z "$OUTPUT")
else
  SIZE=$(stat -c%s "$OUTPUT")
fi

# Retry with higher compression if > 10 MB
if (( SIZE > 10485760 )); then
  echo "⚠️  Output exceeds 10 MB, retrying with higher compression..."
  ffmpeg -y -i "$INPUT" \
    -t "$MAX_DURATION" \
    -vf "scale=1280:720,format=yuv420p" \
    -c:v libx264 -crf 32 -preset fast \
    -r 30 \
    -an \
    "$OUTPUT"
fi

echo "✅ Video saved to $OUTPUT"
