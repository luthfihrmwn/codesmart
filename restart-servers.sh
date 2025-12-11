#!/bin/bash

echo "🔄 Stopping all existing Node.js processes..."
pkill -9 node 2>/dev/null || true
pkill -9 npm 2>/dev/null || true
sleep 2

echo ""
echo "🚀 Starting Backend Server..."
cd /home/luthfi/codesmart/backend
nohup node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 3

if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend server started successfully"
else
    echo "❌ Backend server failed to start"
    echo "Check logs at: /tmp/backend.log"
    tail -20 /tmp/backend.log
    exit 1
fi

echo ""
echo "🌐 Starting Frontend Server..."
cd /home/luthfi/codesmart
nohup npx http-server -p 8080 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
sleep 3

if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ Frontend server started successfully"
else
    echo "❌ Frontend server failed to start"
    echo "Check logs at: /tmp/frontend.log"
    tail -20 /tmp/frontend.log
    exit 1
fi

echo ""
echo "✅ All servers started successfully!"
echo ""
echo "📊 Server Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Backend:  http://localhost:3000 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:8080 (PID: $FRONTEND_PID)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 View logs:"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "🎉 New pages available at:"
echo "  - http://localhost:8080/src/pages/user/announcements-sidebar.html"
echo "  - http://localhost:8080/src/pages/user/discussions-sidebar.html"
echo "  - http://localhost:8080/src/pages/user/materials-sidebar.html"
echo "  - http://localhost:8080/src/pages/user/classes-sidebar.html"
