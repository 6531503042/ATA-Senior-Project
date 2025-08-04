#!/bin/bash

# Do not exit on error
set +e

ata i

echo "🔧 Building admin (Next.js)..."
cd ./frontend/admin
bun run build
if [ $? -ne 0 ]; then
  echo "❌ Failed to build admin"
fi

# echo "🔧 Building main-backend (Webflux)..."
# cd ../../backend/webflux
# bun run build
# if [ $? -ne 0 ]; then
#   echo "❌ Failed to build main-backend"
# fi


echo "✅ Build script finished."