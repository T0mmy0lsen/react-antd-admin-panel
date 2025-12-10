#!/bin/bash

# Deployment script for SDU Expense Frontend
# This script pulls the latest code and deploys the built application

set -e  # Exit on error

echo "Starting deployment..."

# Pull latest code from git
echo "Pulling latest code from git..."
git pull

# Install dependencies (if package.json changed)
echo "Installing dependencies..."
npm ci

# Build the React application
echo "Building React application..."
npm run build

# Copy PDF guide
echo "Copying PDF guide..."
cp public/guides/guide-rejseafregning-zexpense.pdf guide-rejseafregning-zexpense.pdf

# Remove old public directory
echo "Removing old public directory..."
rm -rf public/

# Move build to public
echo "Moving build directory to public..."
mv build/ public/

# Create guides directory
echo "Creating guides directory..."
mkdir -p public/guides/

# Copy PDF guide
echo "Copying PDF guide..."
cp guide-rejseafregning-zexpense.pdf public/guides/

echo "Deployment completed successfully!"
