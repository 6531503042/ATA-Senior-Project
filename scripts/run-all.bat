@echo off
setlocal ENABLEDELAYEDEXPANSION

title ATA All Services Runner
echo ========================================
echo  ATA Senior Project - Run All Services
echo ========================================
echo.

REM Move to repo root (script is expected under scripts\)
cd /d "%~dp0..\"

echo [1/7] Stopping existing processes...
for %%P in (cloudflared.exe caddy.exe node.exe java.exe) do (
  taskkill /IM %%P /F >nul 2>&1
)
REM Give a moment for ports to free
timeout /t 2 >nul

REM Detect cloudflared command (PATH or local file)
set CF_CMD=cloudflared
where cloudflared >nul 2>&1
if errorlevel 1 (
  if exist "%cd%\cloudflared.exe" (
    set CF_CMD="%cd%\cloudflared.exe"
  ) else (
    set CF_CMD=
  )
)

echo [2/7] Starting Backend (Spring Boot)...
start "Backend" cmd /c "cd Backend\main && gradlew.bat bootRun"

echo [3/7] Starting Admin Frontend (Next.js, production)...
set "NODE_OPTIONS=--max-old-space-size=2048"
start "Admin" cmd /c "cd frontend\admin && npm run build && npm run start"

echo [4/7] Starting Employee Frontend (Next.js, production)...
set "NODE_OPTIONS=--max-old-space-size=2048"
start "Employee" cmd /c "cd frontend\employee && npm run build && npm run start"

echo [5/7] Starting Caddy reverse proxy on :8088...
if exist "%cd%\caddy.exe" (
  start "Caddy" cmd /c "cd %cd% && caddy.exe run --config Caddyfile"
) else (
  echo [ERROR] caddy.exe not found in repo root. Please place caddy.exe next to Caddyfile.
)

echo [6/7] Waiting a few seconds for services to bind to ports...
timeout /t 8 >nul

echo [7/7] Starting Cloudflare Tunnel supervisor...
if defined CF_CMD (
  start "Cloudflare Tunnel" powershell -NoExit -ExecutionPolicy Bypass -File "scripts\start-cloudflared.ps1"
) else (
  echo [WARNING] cloudflared not found in PATH or repo root.
  echo           Install with: winget install -e --id Cloudflare.cloudflared
)

echo.
echo ========================================
echo  All services launched in separate windows.
echo  Local URLs:
echo    - Admin:    http://127.0.0.1:8088/admin
echo    - Employee: http://127.0.0.1:8088/employee
echo    - API:      http://127.0.0.1:8088/api
echo.
echo  Cloudflare public URL will appear in the "Cloudflare Tunnel" window.
echo ========================================
echo.
endlocal
exit /b 0


