#!/bin/bash
# Deployment script for Yapper web application

# Configuration
SOURCE_DIR="./"
REMOTE_DIR="/var/www/yapper"
HOST="root@halina305.mikrus.xyz"
PORT="10305"

# Create remote directory if it doesn't exist
echo "Creating remote directory if needed..."
ssh -p $PORT $HOST "mkdir -p $REMOTE_DIR"

# Create tar archive excluding node_modules and other unnecessary files
echo "Archiving and transferring files to server..."
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.DS_Store' \
    --exclude='*.log' \
    -czf - "$SOURCE_DIR" | \
    ssh -p $PORT $HOST "tar -xzf - -C $REMOTE_DIR --strip-components=1 --no-same-owner"

# Confirmation message
echo "Deployment completed successfully!"
echo "Files transferred to $HOST:$REMOTE_DIR"

sleep 10