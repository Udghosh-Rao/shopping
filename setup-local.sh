#!/bin/bash

echo "🚀 UrbanDrip Local Setup Wizard"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    exit 1
fi

echo "📋 Checking your environment setup..."
echo ""

# Check MongoDB URI
if grep -q "username:password" .env.local; then
    echo "⚠️  MongoDB URI not configured"
    echo "   👉 Please set up MongoDB Atlas (FREE):"
    echo "   1. Go to: https://www.mongodb.com/cloud/atlas/register"
    echo "   2. Create FREE cluster (M0 - 512MB)"
    echo "   3. Create database user"
    echo "   4. Get connection string"
    echo "   5. Update MONGODB_URI in .env.local"
    echo ""
    MONGODB_OK=false
else
    echo "✅ MongoDB URI configured"
    MONGODB_OK=true
fi

# Check NEXTAUTH_SECRET
if grep -q "super-secret-nextauth-key-change-me" .env.local; then
    echo "⚠️  NEXTAUTH_SECRET needs to be generated"
    echo ""
    echo "   Generating new secret..."
    NEW_SECRET=$(openssl rand -base64 32)

    # Update .env.local
    sed -i.bak "s/super-secret-nextauth-key-change-me/$NEW_SECRET/" .env.local
    echo "✅ NEXTAUTH_SECRET generated and updated"
    rm .env.local.bak 2>/dev/null
else
    echo "✅ NEXTAUTH_SECRET configured"
fi

# Check ADMIN_EMAIL
if grep -q "admin@example.com" .env.local; then
    echo "⚠️  ADMIN_EMAIL not customized (using default)"
else
    echo "✅ ADMIN_EMAIL configured"
fi

echo ""
echo "================================"
echo ""

if [ "$MONGODB_OK" = true ]; then
    echo "✅ Ready to start development server!"
    echo ""
    echo "Run: npm run dev"
    echo "Then visit: http://localhost:3000"
    echo ""
    echo "Don't forget to seed the database:"
    echo "Visit: http://localhost:3000/api/seed"
else
    echo "❌ MongoDB setup required first"
    echo ""
    echo "📖 See LOCAL_SETUP_GUIDE.md for detailed instructions"
    echo ""
    echo "Quick MongoDB Setup:"
    echo "1. Go to: https://www.mongodb.com/cloud/atlas/register"
    echo "2. Create FREE cluster"
    echo "3. Create database user (username + password)"
    echo "4. Whitelist IP: 0.0.0.0/0"
    echo "5. Get connection string"
    echo "6. Update MONGODB_URI in .env.local"
fi

echo ""
