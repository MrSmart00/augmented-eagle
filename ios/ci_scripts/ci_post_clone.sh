#!/bin/sh
set -e

# Xcode Cloud sets CI=TRUE (uppercase), but Expo expects a lowercase boolean.
# Override to avoid "TRUE is not a boolean" errors.
export CI=true

echo ">>> Installing Node.js..."
brew install node

echo ">>> Installing pnpm..."
npm install -g pnpm@10.33.0

echo ">>> Installing JS dependencies..."
cd "$CI_PRIMARY_REPOSITORY_PATH"
pnpm install --frozen-lockfile

echo ">>> Running expo prebuild..."
npx expo prebuild --platform ios --clean

echo ">>> Installing CocoaPods..."
cd "$CI_PRIMARY_REPOSITORY_PATH/ios"
pod install

echo ">>> ci_post_clone.sh: Done."
