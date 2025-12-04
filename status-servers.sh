#!/bin/bash

# CodeSmart Server Status Script
# Check status of backend and frontend servers

echo "======================================"
echo "   CodeSmart Server Status           "
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# PID files
BACKEND_PID_FILE="/tmp/codesmart-backend.pid"
FRONTEND_PID_FILE="/tmp/codesmart-frontend.pid"
ALT_BACKEND_PID="/tmp/codesmart-server.pid"

# Check Backend Server
echo -e "${BLUE}🔍 Backend Server (Port 5000):${NC}"
BACKEND_RUNNING=false

if [ -f "$BACKEND_PID_FILE" ]; then
    BACKEND_PID=$(cat $BACKEND_PID_FILE)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Running (PID: $BACKEND_PID)${NC}"
        BACKEND_RUNNING=true
    fi
elif [ -f "$ALT_BACKEND_PID" ]; then
    BACKEND_PID=$(cat $ALT_BACKEND_PID)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Running (PID: $BACKEND_PID)${NC}"
        BACKEND_RUNNING=true
    fi
fi

if [ "$BACKEND_RUNNING" = false ]; then
    echo -e "   ${RED}❌ Not running${NC}"
else
    # Test health endpoint
    HEALTH_CHECK=$(curl -s http://localhost:5000/health 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "   ${GREEN}✅ Health check: OK${NC}"
        echo -e "   ${BLUE}📡 API: http://localhost:5000/api/v1${NC}"
    else
        echo -e "   ${RED}⚠️  Health check: Failed${NC}"
    fi
fi

echo ""

# Check Frontend Server
echo -e "${BLUE}🔍 Frontend Server (Port 8080):${NC}"
FRONTEND_RUNNING=false

if [ -f "$FRONTEND_PID_FILE" ]; then
    FRONTEND_PID=$(cat $FRONTEND_PID_FILE)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Running (PID: $FRONTEND_PID)${NC}"
        FRONTEND_RUNNING=true
    fi
fi

if [ "$FRONTEND_RUNNING" = false ]; then
    echo -e "   ${RED}❌ Not running${NC}"
else
    # Test frontend endpoint
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/src/pages/assessor/dashboard-sidebar.html 2>/dev/null)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "   ${GREEN}✅ Accessibility check: OK${NC}"
        echo -e "   ${BLUE}🌐 URL: http://localhost:8080${NC}"
    else
        echo -e "   ${RED}⚠️  Accessibility check: Failed (HTTP $HTTP_CODE)${NC}"
    fi
fi

echo ""

# Check ports
echo -e "${BLUE}🔍 Port Status:${NC}"
PORT_5000=$(lsof -ti:5000 2>/dev/null)
PORT_8080=$(lsof -ti:8080 2>/dev/null)

if [ ! -z "$PORT_5000" ]; then
    echo -e "   ${GREEN}✅ Port 5000: In use by PID $PORT_5000${NC}"
else
    echo -e "   ${RED}❌ Port 5000: Not in use${NC}"
fi

if [ ! -z "$PORT_8080" ]; then
    echo -e "   ${GREEN}✅ Port 8080: In use by PID $PORT_8080${NC}"
else
    echo -e "   ${RED}❌ Port 8080: Not in use${NC}"
fi

echo ""
echo "======================================"

# Overall status
if [ "$BACKEND_RUNNING" = true ] && [ "$FRONTEND_RUNNING" = true ]; then
    echo -e "${GREEN}✅ All servers are running${NC}"
    echo ""
    echo "📱 Quick Access URLs:"
    echo "   • Login:     http://localhost:8080/src/pages/auth/login.html"
    echo "   • Dashboard: http://localhost:8080/src/pages/assessor/dashboard-sidebar.html"
    echo "   • Profile:   http://localhost:8080/src/pages/assessor/profile.html"
    echo "   • API Docs:  http://localhost:5000/api/v1"
    echo ""
    echo "🔑 Assessor Credentials:"
    echo "   Username: guru"
    echo "   Password: guru123"
elif [ "$BACKEND_RUNNING" = true ] || [ "$FRONTEND_RUNNING" = true ]; then
    echo -e "${YELLOW}⚠️  Some servers are not running${NC}"
    echo ""
    echo "To start all servers: ./start-servers.sh"
else
    echo -e "${RED}❌ No servers are running${NC}"
    echo ""
    echo "To start servers: ./start-servers.sh"
fi

echo "======================================"
