#!/bin/bash
apt-get update
apt-get install -qq -y nodejs npm
npm install bl node-uuid concat-stream
nodejs /hypertoc-api/hypertoc-api.js &
echo "Starting nginx..."
nginx
