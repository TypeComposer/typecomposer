#!/usr/bin/env bash
set -euo pipefail

# Script to move top-level component files into kebab-case folders
# e.g. ColorPicker.ts -> color-picker/ColorPicker.ts

cd "$(dirname "$0")/src/core/components"

kebab() {
  # convert PascalCase or camelCase to kebab-case
  # examples: ColorPicker -> color-picker, DropDown -> drop-down
  echo "$1" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]'
}

echo "Moving .ts files into kebab-case folders in $(pwd)"

# move .ts files (only files in current directory)
for f in *.ts; do
  [ -f "$f" ] || continue
  [[ "$f" == index.* ]] && continue
  name="${f%.ts}"
  folder="$(kebab "$name")"
  mkdir -p "$folder"
  git mv "$f" "$folder/$f"
done

echo "Moving .css files into kebab-case folders in $(pwd)"

# move .css files
for f in *.css; do
  [ -f "$f" ] || continue
  [[ "$f" == index.* ]] && continue
  name="${f%.css}"
  folder="$(kebab "$name")"
  mkdir -p "$folder"
  git mv "$f" "$folder/$f"
done

echo "Done: moved component files into individual kebab-case folders under src/core/components/"