#!/bin/bash

# Health check script for monitoring application status
# Can be used with Docker HEALTHCHECK or external monitoring

set -e

# Configuration
PORT="${PORT:-8080}"
HOST="${HOST:-127.0.0.1}"
TIMEOUT="${TIMEOUT:-5}"
RETRIES="${RETRIES:-3}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Track retry count
ATTEMPT=1

while [ $ATTEMPT -le $RETRIES ]; do
    echo "Health check attempt $ATTEMPT of $RETRIES..."
    
    # Check if server is responding
    if curl -f --silent --show-error --connect-timeout $TIMEOUT \
        --max-time $TIMEOUT \
        "http://${HOST}:${PORT}/" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Health check passed${NC}"
        exit 0
    fi
    
    if [ $ATTEMPT -lt $RETRIES ]; then
        echo "Waiting before retry..."
        sleep 2
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
done

echo -e "${RED}❌ Health check failed after $RETRIES attempts${NC}"
exit 1
