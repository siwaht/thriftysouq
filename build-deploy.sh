#!/bin/bash

# Build and deployment script for ThriftySouq
echo "Building application for deployment..."

# Run the standard build
npm run build

# Copy static files to the expected location for production serving
echo "Setting up static files for production..."
mkdir -p server/public
cp -r dist/public/* server/public/

echo "Build complete! Static files copied to server/public/"
echo "Ready for deployment."

# Test production server on port 8000 briefly
echo "Testing production server..."
PORT=8000 NODE_ENV=production timeout 3 node dist/index.js &
sleep 2
if curl -s http://localhost:8000/ > /dev/null; then
    echo "Production server test: SUCCESS"
else
    echo "Production server test: FAILED"
fi
pkill -f "PORT=8000" 2>/dev/null || true