# Health check script for all services
# This script checks if all services are healthy and ready

$ErrorActionPreference = "Continue"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Service Health Check" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$allHealthy = $true

# Check Backend
Write-Host "[1/4] Checking Backend (8080)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8080/api/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  ✓ Backend is healthy" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Backend is not responding: $($_.Exception.Message)" -ForegroundColor Red
    $allHealthy = $false
}

# Check Admin Frontend
Write-Host "[2/4] Checking Admin Frontend (3000)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3000/admin" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  ✓ Admin Frontend is healthy" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Admin Frontend is not responding: $($_.Exception.Message)" -ForegroundColor Red
    $allHealthy = $false
}

# Check Employee Frontend
Write-Host "[3/4] Checking Employee Frontend (3001)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3001/employee/login" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  ✓ Employee Frontend is healthy" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Employee Frontend is not responding: $($_.Exception.Message)" -ForegroundColor Red
    $allHealthy = $false
}

# Check Caddy
Write-Host "[4/4] Checking Caddy (8088)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8088/admin" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  ✓ Caddy is healthy" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Caddy is not responding: $($_.Exception.Message)" -ForegroundColor Red
    $allHealthy = $false
}

Write-Host ""
if ($allHealthy) {
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  All services are healthy!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    exit 0
} else {
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "  Some services are unhealthy!" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Recommendations:" -ForegroundColor Yellow
    Write-Host "  1. Restart unhealthy services" -ForegroundColor White
    Write-Host "  2. Check service logs" -ForegroundColor White
    Write-Host "  3. Wait a few seconds and try again" -ForegroundColor White
    exit 1
}

