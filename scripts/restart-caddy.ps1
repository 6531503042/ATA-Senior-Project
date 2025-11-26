# Restart Caddy Reverse Proxy
# This script stops all Caddy processes and starts a new one

$ErrorActionPreference = "Continue"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Restart Caddy Reverse Proxy" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop all Caddy processes
Write-Host "[1/3] Stopping all Caddy processes..." -ForegroundColor Yellow
$caddyProcesses = Get-Process caddy -ErrorAction SilentlyContinue
if ($caddyProcesses) {
    Write-Host "  Found $($caddyProcesses.Count) Caddy process(es)" -ForegroundColor Gray
    Stop-Process -Name caddy -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "  All Caddy processes stopped" -ForegroundColor Green
} else {
    Write-Host "  No Caddy processes running" -ForegroundColor Green
}

# Step 2: Free up ports
Write-Host "[2/3] Freeing up ports..." -ForegroundColor Yellow
Start-Sleep -Seconds 1

# Check and free port 2019 (admin API)
$port2019 = netstat -ano | findstr ":2019" | Select-Object -First 1
if ($port2019) {
    $pid = ($port2019 -split '\s+')[-1]
    if ($pid -and $pid -match '^\d+$') {
        Write-Host "  Freeing port 2019 (PID: $pid)..." -ForegroundColor Gray
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}

# Check and free port 8088 (HTTP)
$port8088 = netstat -ano | findstr ":8088" | Select-Object -First 1
if ($port8088) {
    $pid = ($port8088 -split '\s+')[-1]
    if ($pid -and $pid -match '^\d+$') {
        Write-Host "  Freeing port 8088 (PID: $pid)..." -ForegroundColor Gray
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}

Write-Host "  Ports freed" -ForegroundColor Green

# Step 3: Start Caddy
Write-Host "[3/3] Starting Caddy..." -ForegroundColor Yellow

# Check if caddy.exe exists
if (-not (Test-Path ".\caddy.exe")) {
    Write-Host "  caddy.exe not found in current directory" -ForegroundColor Red
    Write-Host "    Please ensure caddy.exe is in the project root" -ForegroundColor Yellow
    exit 1
}

# Validate Caddyfile
Write-Host "  Validating Caddyfile..." -ForegroundColor Gray
try {
    $null = & ".\caddy.exe" validate --config Caddyfile 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Caddyfile validation failed" -ForegroundColor Red
        Write-Host "    Please check Caddyfile syntax" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "  Caddyfile is valid" -ForegroundColor Green
} catch {
    Write-Host "  Could not validate Caddyfile (continuing anyway)" -ForegroundColor Yellow
}

# Start Caddy
Start-Process -FilePath ".\caddy.exe" -ArgumentList @("run", "--config", "Caddyfile", "--pidfile", "caddy.pid") -WindowStyle Minimized
Start-Sleep -Seconds 3

# Verify Caddy started
$caddy = Get-Process caddy -ErrorAction SilentlyContinue
if ($caddy) {
    Write-Host "  Caddy started successfully (PID: $($caddy.Id))" -ForegroundColor Green
    
    # Check if port 8088 is listening
    Start-Sleep -Seconds 1
    $port8088 = netstat -ano | findstr ":8088" | Select-Object -First 1
    if ($port8088) {
        Write-Host "  Caddy is listening on port 8088" -ForegroundColor Green
    } else {
        Write-Host "  Caddy started but port 8088 not listening yet" -ForegroundColor Yellow
    }
} else {
    Write-Host "  Caddy failed to start" -ForegroundColor Red
    Write-Host "    Check logs for details" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Caddy Restarted Successfully" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "  - Admin:    http://127.0.0.1:8088/admin" -ForegroundColor White
Write-Host "  - Employee: http://127.0.0.1:8088/employee" -ForegroundColor White
Write-Host "  - API:      http://127.0.0.1:8088/api" -ForegroundColor White
Write-Host ""
