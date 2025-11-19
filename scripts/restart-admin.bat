@echo off
cd /d "%~dp0..\frontend\admin"
set NODE_OPTIONS=--max-old-space-size=2048
if not exist .next (
    echo Building admin frontend...
    call npm run build
)
echo Starting admin frontend on port 3000...
start "Admin Frontend" cmd /c "cd /d %~dp0..\frontend\admin && set NODE_OPTIONS=--max-old-space-size=2048 && npm run start"
