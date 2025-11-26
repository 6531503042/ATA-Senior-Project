# Fix 504 Gateway Timeout Error
# This script diagnoses and fixes timeout issues

$ErrorActionPreference = "Continue"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  504 Gateway Timeout Fix" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check services
Write-Host "[1/5] Checking services..." -ForegroundColor Yellow
$backend = netstat -ano | findstr ":8080" | Select-Object -First 1
$admin = netstat -ano | findstr ":3000" | Select-Object -First 1
$employee = netstat -ano | findstr ":3001" | Select-Object -First 1
$caddy = netstat -ano | findstr ":8088" | Select-Object -First 1

if ($backend) { Write-Host "  ✓ Backend (8080): Running" -ForegroundColor Green } else { Write-Host "  ✗ Backend (8080): Not running" -ForegroundColor Red }
if ($admin) { Write-Host "  ✓ Admin Frontend (3000): Port open" -ForegroundColor Yellow } else { Write-Host "  ✗ Admin Frontend (3000): Not running" -ForegroundColor Red }
if ($employee) { Write-Host "  ✓ Employee Frontend (3001): Running" -ForegroundColor Green } else { Write-Host "  ✗ Employee Frontend (3001): Not running" -ForegroundColor Red }
if ($caddy) { Write-Host "  ✓ Caddy (8088): Running" -ForegroundColor Green } else { Write-Host "  ✗ Caddy (8088): Not running" -ForegroundColor Red }

Write-Host ""

# 2. Test services
Write-Host "[2/5] Testing services..." -ForegroundColor Yellow

Write-Host "  Testing Employee Frontend..." -ForegroundColor Gray
try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:3001/employee/login" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "    ✓ Employee Frontend: OK" -ForegroundColor Green
} catch {
    Write-Host "    ✗ Employee Frontend: Not responding" -ForegroundColor Red
}

Write-Host "  Testing Admin Frontend..." -ForegroundColor Gray
try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:3000/admin" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "    ✓ Admin Frontend: OK" -ForegroundColor Green
} catch {
    Write-Host "    ✗ Admin Frontend: Not responding (may need restart)" -ForegroundColor Yellow
}

Write-Host ""

# 3. Restart Caddy with updated timeout
Write-Host "[3/5] Restarting Caddy with increased timeout..." -ForegroundColor Yellow
$caddyProcess = Get-Process caddy -ErrorAction SilentlyContinue
if ($caddyProcess) {
    Stop-Process -Name caddy -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}
Start-Process -FilePath "caddy.exe" -ArgumentList @("run", "--config", "Caddyfile", "--pidfile", "caddy.pid") -WindowStyle Minimized
Start-Sleep -Seconds 3
$caddyNew = Get-Process caddy -ErrorAction SilentlyContinue
if ($caddyNew) {
    Write-Host "  ✓ Caddy restarted (PID: $($caddyNew.Id))" -ForegroundColor Green
} else {
    Write-Host "  ✗ Caddy failed to restart" -ForegroundColor Red
}

Write-Host ""

# 4. Test through Caddy
Write-Host "[4/5] Testing through Caddy..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

Write-Host "  Testing Employee via Caddy..." -ForegroundColor Gray
try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:8088/employee/login" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "    ✓ Employee via Caddy: OK" -ForegroundColor Green
} catch {
    Write-Host "    ✗ Employee via Caddy: Failed" -ForegroundColor Red
}

Write-Host "  Testing Admin via Caddy..." -ForegroundColor Gray
try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:8088/admin" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "    ✓ Admin via Caddy: OK" -ForegroundColor Green
} catch {
    Write-Host "    ✗ Admin via Caddy: Failed (Admin Frontend may need restart)" -ForegroundColor Yellow
}

Write-Host ""

# 5. Recommendations
Write-Host "[5/5] Recommendations..." -ForegroundColor Yellow
Write-Host ""
Write-Host "If Admin Frontend is not responding:" -ForegroundColor Cyan
Write-Host "  1. Restart Admin Frontend:" -ForegroundColor White
Write-Host "     cd frontend\admin" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "If Employee Frontend is not responding:" -ForegroundColor Cyan
Write-Host "  1. Restart Employee Frontend:" -ForegroundColor White
Write-Host "     cd frontend\employee" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Caddy timeout has been increased to 60s" -ForegroundColor Green
Write-Host ""






