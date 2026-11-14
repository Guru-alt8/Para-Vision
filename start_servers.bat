@echo off
echo Starting AccessMap India Backend...
start "AccessMap Backend" cmd /k "cd backend && node server.js"

echo Starting AccessMap India Frontend...
start "AccessMap Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers are starting in separate windows!
