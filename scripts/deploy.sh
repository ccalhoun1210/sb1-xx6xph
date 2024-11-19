#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env.production

# Update system packages
echo "Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PostgreSQL if not present
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    sudo apt-get install -y postgresql postgresql-contrib
fi

# Install Redis if not present
if ! command -v redis-cli &> /dev/null; then
    echo "Installing Redis..."
    sudo apt-get install -y redis-server
fi

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt-get install -y nginx
fi

# Install project dependencies
echo "Installing project dependencies..."
npm ci

# Generate Prisma client
echo "Generating Prisma client..."
npm run prisma:generate

# Run database migrations
echo "Running database migrations..."
npm run prisma:migrate

# Build the application
echo "Building the application..."
npm run build
npm run server:build

# Set up Nginx configuration
echo "Configuring Nginx..."
sudo cp nginx/conf.d/app.conf /etc/nginx/conf.d/
sudo nginx -t
sudo systemctl reload nginx

# Set up PM2 for process management
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Start the application with PM2
echo "Starting the application..."
pm2 start ecosystem.config.js --env production

echo "Deployment completed successfully!"
echo "Next steps:"
echo "1. Update DNS records to point to your server IP"
echo "2. Configure SSL certificates using certbot"
echo "3. Update environment variables with production values"