@echo off
REM LocalTunnel launcher for ATA portal
REM Double-click to start tunnels in separate windows

REM Combined reverse proxy (Caddy at :8088)
start "LT 8088 (ata-portal)" cmd /k npx localtunnel --port 8088 --subdomain ata-portal --print-requests

REM Expose services individually as well (admin and employee)
start "LT 3000 (ata-admin)" cmd /k npx localtunnel --port 3000 --subdomain ata-admin --print-requests
start "LT 3001 (ata-employee)" cmd /k npx localtunnel --port 3001 --subdomain ata-employee --print-requests
REM Optional: direct API tunnel
REM start "LT 8080 (ata-api)" cmd /k npx localtunnel --port 8080 --subdomain ata-api --print-requests

echo Tunnels starting... Keep these windows open to stay online.
exit /b 0


