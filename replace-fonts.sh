#!/bin/bash

# Replace font-display with font-sans in all tsx and ts files
find src -name "*.tsx" -o -name "*.ts" | while read file; do
    sed -i 's/font-display/font-sans/g' "$file"
    sed -i 's/font-happy/font-sans/g' "$file"
    echo "Updated: $file"
done

echo "Font replacement completed!"
