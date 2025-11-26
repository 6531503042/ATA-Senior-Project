# Start All Services + Cloudflare Tunnel
# This script starts Caddy, Backend, Frontends, and Cloudflare Tunnel

$ErrorActionPreference = "Continue"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Starting All Services + Tunnel" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Caddy is running
$caddyRunning = Get-Process caddy -ErrorAction SilentlyContinue
if (-not $caddyRunning) {
    Write-Host "[1/5] Starting Caddy reverse proxy..." -ForegroundColor Green
    Start-Process -FilePath "caddy.exe" -ArgumentList @("run", "--config", "Caddyfile", "--pidfile", "caddy.pid") -WindowStyle Minimized
    Start-Sleep -Seconds 3
    
    $caddy = Get-Process caddy -ErrorAction SilentlyContinue
    if ($caddy) {
        Write-Host "  ✓ Caddy started (PID: $($caddy.Id))" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Caddy failed to start!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[1/5] Caddy is already running (PID: $($caddyRunning.Id))" -ForegroundColor Yellow
}

# Check if port 8088 is listening
Start-Sleep -Seconds 2
$port8088 = netstat -ano | findstr ":8088"
if (-not $port8088) {
    Write-Host "  ⚠ Warning: Port 8088 is not listening. Caddy may not be ready yet." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[2/5] Checking Backend (port 8080)..." -ForegroundColor Cyan
$backendRunning = netstat -ano | findstr ":8080"
if (-not $backendRunning) {
    Write-Host "  ⚠ Backend is not running. Please start it manually:" -ForegroundColor Yellow
    Write-Host "    cd Backend\main && gradlew.bat bootRun" -ForegroundColor White
} else {
    Write-Host "  ✓ Backend is running" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/5] Checking Admin Frontend (port 3000)..." -ForegroundColor Cyan
$adminRunning = netstat -ano | findstr ":3000"
if (-not $adminRunning) {
    Write-Host "  ⚠ Admin Frontend is not running. Please start it manually:" -ForegroundColor Yellow
    Write-Host "    cd frontend\admin && npm run dev" -ForegroundColor White
} else {
    Write-Host "  ✓ Admin Frontend is running" -ForegroundColor Green
}

Write-Host ""
Write-Host "[4/5] Checking Employee Frontend (port 3001)..." -ForegroundColor Cyan
$employeeRunning = netstat -ano | findstr ":3001"
if (-not $employeeRunning) {
    Write-Host "  ⚠ Employee Frontend is not running. Please start it manually:" -ForegroundColor Yellow
    Write-Host "    cd frontend\employee && npm run dev" -ForegroundColor White
} else {
    Write-Host "  ✓ Employee Frontend is running" -ForegroundColor Green
}

Write-Host ""
Write-Host "[5/5] Starting Cloudflare Tunnel..." -ForegroundColor Cyan

# Stop existing tunnel
$existingTunnel = Get-Process cloudflared -ErrorAction SilentlyContinue
if ($existingTunnel) {
    Write-Host "  Stopping existing tunnel..." -ForegroundColor Yellow
    Stop-Process -Name cloudflared -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Check if named tunnel is configured
$configFile = "config\cloudflare\config.yml"
$credentialsFile = "config\cloudflare\credentials.json"

if ((Test-Path $configFile) -and (Test-Path $credentialsFile)) {
    Write-Host "  Using Named Tunnel (Static Domain)..." -ForegroundColor Green
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$PWD'; .\scripts\cloudflare\start-named-tunnel.ps1"
    )
} else {
    Write-Host "  Using Quick Tunnel (Temporary URL)..." -ForegroundColor Yellow
    Write-Host "  ⚠ URL will change on restart. For static domain, setup Named Tunnel:" -ForegroundColor Yellow
    Write-Host "    See: docs\cloudflare\SETUP_NAMED_TUNNEL.md" -ForegroundColor Cyan
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$PWD'; .\scripts\cloudflare\start-quick-tunnel.ps1"
    )
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Services Started!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Waiting for tunnel URL..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

if (Test-Path "logs\current-cloudflare-url.txt") {
    $url = Get-Content "logs\current-cloudflare-url.txt" -Raw
    Write-Host ""
    Write-Host "Tunnel URL: $url" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Endpoints:" -ForegroundColor Yellow
    Write-Host "  Admin:    $url/admin" -ForegroundColor White
    Write-Host "  Employee: $url/employee" -ForegroundColor White
    Write-Host "  API:      $url/api" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Tunnel is starting... Check logs: logs\cloudflared.log" -ForegroundColor Yellow
    Write-Host "Or run: .\scripts\cloudflare\get-url.ps1" -ForegroundColor Cyan
}

Write-Host ""






