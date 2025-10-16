#!/bin/bash

# QuickFold iOS Setup Script
# This script helps set up the iOS project for React Native

echo "🔧 QuickFold iOS Setup"
echo "======================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the root directory"
    echo "💡 Run: cd /Users/arjundev/Work/Projects/QuickFold/Repo/quickfold-cutomer-app"
    exit 1
fi

echo "✅ Found package.json"

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Error: Xcode is not installed"
    echo "💡 Please install Xcode from the App Store"
    exit 1
fi

echo "✅ Xcode is installed"

# Check if we're in the iOS directory
if [ ! -d "ios" ]; then
    echo "❌ Error: iOS directory not found"
    echo "💡 Make sure you're in the project root directory"
    exit 1
fi

echo "✅ iOS directory found"

# Navigate to iOS directory
cd ios

# Check if Podfile exists
if [ ! -f "Podfile" ]; then
    echo "❌ Error: Podfile not found in ios directory"
    echo "💡 The iOS project structure may be incomplete"
    exit 1
fi

echo "✅ Podfile found"

# Install CocoaPods if not installed
if ! command -v pod &> /dev/null; then
    echo "📦 Installing CocoaPods..."
    sudo gem install cocoapods
fi

echo "✅ CocoaPods is available"

# Clean and install pods
echo "🧹 Cleaning previous pod installation..."
rm -rf Pods Podfile.lock

echo "📦 Installing pods..."
pod install

if [ $? -eq 0 ]; then
    echo "✅ Pods installed successfully"
else
    echo "❌ Pod installation failed"
    exit 1
fi

# Go back to root directory
cd ..

echo ""
echo "🎉 iOS setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start Metro bundler: npm start"
echo "2. Run iOS app: npm run ios"
echo ""
echo "🚀 Quick start:"
echo "npm start    # Terminal 1"
echo "npm run ios  # Terminal 2"

