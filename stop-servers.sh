#!/bin/bash

# CodeSmart Stop Script
# Stop both backend and frontend servers

echo "======================================"
echo "   CodeSmart Server Shutdown         "
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# PID files
BACKEND_PID_FILE="/tmp/codesmart-backend.pid"
FRONTEND_PID_FILE="/tmp/codesmart-frontend.pid"

# Alternative PID files (from previous runs)
ALT_BACKEND_PID="/tmp/codesmart-server.pid"
ALT_FRONTEND_PID="/tmp/codesmart-frontend.pid"

STOPPED_COUNT=0

# Function to stop a process
stop_process() {
    local PID_FILE=$1
    local NAME=$2

    if [ -f "$PID_FILE" ]; then
        PID=$(cat $PID_FILE)
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${YELLOW}🛑 Stopping $NAME (PID: $PID)...${NC}"
            kill $PID
            sleep 1

            # Force kill if still running
            if ps -p $PID > /dev/null 2>&1; then
                echo -e "${YELLOW}   Force killing $NAME...${NC}"
                kill -9 $PID
            fi

            if ! ps -p $PID > /dev/null 2>&1; then
                echo -e "${GREEN}✅ $NAME stopped successfully${NC}"
                rm -f $PID_FILE
                STOPPED_COUNT=$((STOPPED_COUNT + 1))
            else
                echo -e "${RED}❌ Failed to stop $NAME${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️  $NAME not running (stale PID file)${NC}"
            rm -f $PID_FILE
        fi
    else
        echo -e "${YELLOW}⚠️  $NAME PID file not found${NC}"
    fi
}

# Stop backend server
stop_process "$BACKEND_PID_FILE" "Backend Server"

# Check alternative backend PID file
if [ -f "$ALT_BACKEND_PID" ] && [ "$ALT_BACKEND_PID" != "$BACKEND_PID_FILE" ]; then
    stop_process "$ALT_BACKEND_PID" "Backend Server (alt)"
fi

echo ""

# Stop frontend server
stop_process "$FRONTEND_PID_FILE" "Frontend Server"

# Also kill any python http.server on port 8080
PYTHON_PIDS=$(lsof -ti:8080 2>/dev/null)
if [ ! -z "$PYTHON_PIDS" ]; then
    echo -e "${YELLOW}🛑 Stopping additional processes on port 8080...${NC}"
    for PID in $PYTHON_PIDS; do
        kill $PID 2>/dev/null
        echo -e "${GREEN}✅ Stopped process $PID${NC}"
        STOPPED_COUNT=$((STOPPED_COUNT + 1))
    done
fi

# Also kill any node processes on port 5000
NODE_PIDS=$(lsof -ti:5000 2>/dev/null)
if [ ! -z "$NODE_PIDS" ]; then
    echo -e "${YELLOW}🛑 Stopping additional processes on port 5000...${NC}"
    for PID in $NODE_PIDS; do
        kill $PID 2>/dev/null
        echo -e "${GREEN}✅ Stopped process $PID${NC}"
        STOPPED_COUNT=$((STOPPED_COUNT + 1))
    done
fi

echo ""
echo "======================================"
if [ $STOPPED_COUNT -gt 0 ]; then
    echo -e "${GREEN}✅ All servers stopped ($STOPPED_COUNT processes)${NC}"
else
    echo -e "${YELLOW}⚠️  No running servers found${NC}"
fi
echo "======================================"
