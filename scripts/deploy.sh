#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKER_REGISTRY="${DOCKER_REGISTRY:-ghcr.io}"
IMAGE_NAME="clear-command-docs"
ENVIRONMENT="${1:-production}"

echo -e "${YELLOW}🚀 Starting deployment...${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker daemon is not running${NC}"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed${NC}"
    exit 1
fi

# Build or pull image
if [ "$ENVIRONMENT" == "development" ]; then
    echo -e "${YELLOW}📦 Building development image...${NC}"
    docker build -f Dockerfile.dev -t ${IMAGE_NAME}:dev .
    echo -e "${GREEN}✅ Development image built${NC}"
else
    echo -e "${YELLOW}📦 Building production image...${NC}"
    docker build -f Dockerfile -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest .
    echo -e "${GREEN}✅ Production image built${NC}"
fi

# Start containers
echo -e "${YELLOW}🐳 Starting containers...${NC}"

if [ "$ENVIRONMENT" == "development" ]; then
    docker-compose down --remove-orphans 2>/dev/null || true
    docker-compose up -d
    COMPOSE_FILE="docker-compose.yml"
else
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml up -d
    COMPOSE_FILE="docker-compose.prod.yml"
fi

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check health
if [ "$ENVIRONMENT" == "development" ]; then
    if docker-compose ps app | grep -q "healthy"; then
        echo -e "${GREEN}✅ Development server is healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  Service may be starting, checking again...${NC}"
        sleep 5
    fi
else
    if docker-compose -f docker-compose.prod.yml ps app | grep -q "healthy"; then
        echo -e "${GREEN}✅ Application is healthy${NC}"
    else
        echo -e "${RED}❌ Application health check failed${NC}"
        docker-compose -f docker-compose.prod.yml logs
        exit 1
    fi
fi

# Display services status
echo -e "${YELLOW}📊 Service Status:${NC}"
if [ "$ENVIRONMENT" == "development" ]; then
    docker-compose ps
    echo -e "${GREEN}✅ Development environment ready!${NC}"
    echo -e "${GREEN}🌐 Access application at http://localhost:8080${NC}"
else
    docker-compose -f docker-compose.prod.yml ps
    echo -e "${GREEN}✅ Production environment ready!${NC}"
    echo -e "${GREEN}🌐 Access application at http://localhost${NC}"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
