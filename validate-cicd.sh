#!/bin/bash

# Validation script for GitHub Actions CI/CD setup
# Tests all linting and build steps locally

set -e

echo "🧹 Testing Frontend Linting..."
npm run lint

echo "✨ Testing Code Formatting..."
npm run format:check

echo "🦀 Testing Rust Formatting..."
npm run rust:fmt:check

echo "🔨 Testing Frontend Build..."
npm run build

echo "✅ All validation checks passed!"
echo ""
echo "🚀 GitHub Actions Setup Complete:"
echo "   - Linting: ESLint + Prettier + rustfmt + clippy"
echo "   - Builds: Frontend + Multiplatform Tauri"
echo "   - Releases: Automated beta releases on push to main"
echo "   - Binaries: Windows .msi + Linux .AppImage"
echo ""
echo "📝 To trigger CI/CD: Push changes to 'main' branch"
echo "📦 Download releases from: GitHub Releases page"