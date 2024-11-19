#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file.tar.gz>"
    exit 1
fi

BACKUP_FILE=$1
TEMP_DIR="/tmp/rainbow-restore"

# Create temporary directory
mkdir -p $TEMP_DIR

# Extract backup
tar -xzf $BACKUP_FILE -C $TEMP_DIR

# Restore database
docker-compose -f docker-compose.prod.yml exec -T db \
    psql -U $DB_USER $DB_NAME < "$TEMP_DIR/db_backup_"*".sql"

# Restore files to S3
aws s3 sync "$TEMP_DIR/files_"* s3://$AWS_BUCKET_NAME

# Clean up
rm -rf $TEMP_DIR

echo "Restore completed successfully!"