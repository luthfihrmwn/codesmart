#!/bin/bash

# CodeSmart Deployment Script
# Start both backend and frontend servers

echo "======================================"
echo "   CodeSmart Deployment Manager      "
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directory paths
BACKEND_DIR="/home/luthfi/codesmart/backend"
FRONTEND_DIR="/home/luthfi/codesmart"

# PID files
BACKEND_PID_FILE="/tmp/codesmart-backend.pid"
FRONTEND_PID_FILE="/tmp/codesmart-frontend.pid"

# Log files
BACKEND_LOG="/tmp/codesmart-backend.log"
FRONTEND_LOG="/tmp/codesmart-frontend.log"

# Check if backend is already running
if [ -f "$BACKEND_PID_FILE" ]; then
    BACKEND_PID=$(cat $BACKEND_PID_FILE)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Backend server is already running (PID: $BACKEND_PID)${NC}"
    else
        rm -f $BACKEND_PID_FILE
    fi
fi

# Check if frontend is already running
if [ -f "$FRONTEND_PID_FILE" ]; then
    FRONTEND_PID=$(cat $FRONTEND_PID_FILE)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Frontend server is already running (PID: $FRONTEND_PID)${NC}"
    else
        rm -f $FRONTEND_PID_FILE
    fi
fi

# Start Backend Server
echo -e "${BLUE}🚀 Starting Backend Server...${NC}"
cd $BACKEND_DIR

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
fi

# Start backend in background
npm run dev > $BACKEND_LOG 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > $BACKEND_PID_FILE

sleep 3

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend server started successfully${NC}"
    echo -e "   PID: $BACKEND_PID"
    echo -e "   URL: ${BLUE}http://localhost:5000${NC}"
    echo -e "   API: ${BLUE}http://localhost:5000/api/v1${NC}"
    echo -e "   Log: $BACKEND_LOG"
else
    echo -e "${RED}❌ Backend server failed to start${NC}"
    echo "Check logs at: $BACKEND_LOG"
    exit 1
fi

echo ""

# Start Frontend Server
echo -e "${BLUE}🌐 Starting Frontend Server...${NC}"
cd $FRONTEND_DIR

# Start frontend in background
python3 -m http.server 8080 > $FRONTEND_LOG 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > $FRONTEND_PID_FILE

sleep 2

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend server started successfully${NC}"
    echo -e "   PID: $FRONTEND_PID"
    echo -e "   URL: ${BLUE}http://localhost:8080${NC}"
    echo -e "   Log: $FRONTEND_LOG"
else
    echo -e "${RED}❌ Frontend server failed to start${NC}"
    echo "Check logs at: $FRONTEND_LOG"
    exit 1
fi

echo ""
echo "======================================"
echo -e "${GREEN}✅ All servers are running!${NC}"
echo "======================================"
echo ""
echo "📱 Access URLs:"
echo "   • Login:     http://localhost:8080/src/pages/auth/login.html"
echo "   • Dashboard: http://localhost:8080/src/pages/assessor/dashboard-sidebar.html"
echo "   • Profile:   http://localhost:8080/src/pages/assessor/profile.html"
echo ""
echo "🔑 Assessor Login Credentials:"
echo "   Username: guru"
echo "   Password: guru123"
echo ""
echo "📊 Server Status:"
echo "   • Backend:  http://localhost:5000/health"
echo "   • Frontend: http://localhost:8080"
echo ""
echo "📝 To stop servers, run: ./stop-servers.sh"
echo "======================================"
