#!/bin/bash

echo "🔧 Setting up MongoDB for local development..."

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "📦 MongoDB is not installed. Installing..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew is not installed. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    # Install MongoDB
    brew tap mongodb/brew
    brew install mongodb-community
    
    echo "✅ MongoDB installed successfully!"
else
    echo "✅ MongoDB is already installed"
fi

# Start MongoDB service
echo "🚀 Starting MongoDB service..."
brew services start mongodb-community

# Wait a moment for MongoDB to start
sleep 3

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running successfully!"
    echo "📊 You can now start your backend server with: npm run dev"
else
    echo "❌ MongoDB failed to start. Please check the logs:"
    echo "   brew services list | grep mongodb"
    exit 1
fi

echo ""
echo "🎉 Setup complete! Your MongoDB is ready for development."
echo "📝 Connection string: mongodb://localhost:27017/myomectomy_db" 