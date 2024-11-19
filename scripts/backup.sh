#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Set backup directory
BACKUP_DIR="/var/backups/rainbow-service"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup PostgreSQL database
docker-compose -f docker-compose.prod.yml exec -T db \
    pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Backup uploaded files from S3
aws s3 sync s3://$AWS_BUCKET_NAME "$BACKUP_DIR/files_$TIMESTAMP"

# Compress backups
tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" \
    "$BACKUP_DIR/db_backup_$TIMESTAMP.sql" \
    "$BACKUP_DIR/files_$TIMESTAMP"

# Remove uncompressed files
rm "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
rm -rf "$BACKUP_DIR/files_$TIMESTAMP"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"