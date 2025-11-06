# Complete Service Startup Script
# Starts Backend, Admin Frontend, Employee Frontend, Caddy, and Cloudflare Tunnel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting All Services for Public URL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $null -ne $connection
}

# Function to wait for service to be ready
function Wait-ForService {
    param(
        [string]$ServiceName,
        [int]$Port,
        [int]$MaxWaitSeconds = 60
    )
    $waited = 0
    Write-Host "Waiting for $ServiceName to be ready on port $Port..." -ForegroundColor Yellow
    while (-not (Test-Port -Port $Port) -and $waited -lt $MaxWaitSeconds) {
        Start-Sleep -Seconds 2
        $waited += 2
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    Write-Host ""
    if (Test-Port -Port $Port) {
        Write-Host "[OK] $ServiceName is ready!" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[ERROR] $ServiceName failed to start within $MaxWaitSeconds seconds" -ForegroundColor Red
        return $false
    }
}

# Stop existing processes
Write-Host "Stopping existing services..." -ForegroundColor Yellow
Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*MainApplication*" -or $_.Path -like "*main*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "caddy" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 1. Start Backend (Spring Boot)
Write-Host ""
Write-Host "1. Starting Backend (Spring Boot)..." -ForegroundColor Cyan
$backendPath = "Backend\main"
if (Test-Path $backendPath) {
    $backendProcess = Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PWD\$backendPath'; Write-Host 'Starting Spring Boot Backend...' -ForegroundColor Cyan; .\gradlew.bat bootRun" -PassThru -WindowStyle Minimized
    Write-Host "[OK] Backend process started (PID: $($backendProcess.Id))" -ForegroundColor Green
    Write-Host "    Waiting for backend to be ready..." -ForegroundColor Yellow
    if (Wait-ForService -ServiceName "Backend" -Port 8080 -MaxWaitSeconds 90) {
        Write-Host "    Backend is ready at http://127.0.0.1:8080" -ForegroundColor Green
    }
} else {
    Write-Host "[ERROR] Backend directory not found: $backendPath" -ForegroundColor Red
}

# 2. Start Admin Frontend
Write-Host ""
Write-Host "2. Starting Admin Frontend (Next.js)..." -ForegroundColor Cyan
$adminPath = "frontend\admin"
if (Test-Path $adminPath) {
    $adminProcess = Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PWD\$adminPath'; Write-Host 'Starting Admin Frontend...' -ForegroundColor Cyan; `$env:NODE_OPTIONS='--max-old-space-size=2048'; npm run start" -PassThru -WindowStyle Minimized
    Write-Host "[OK] Admin frontend process started (PID: $($adminProcess.Id))" -ForegroundColor Green
    Write-Host "    Waiting for admin frontend to be ready..." -ForegroundColor Yellow
    if (Wait-ForService -ServiceName "Admin Frontend" -Port 3000 -MaxWaitSeconds 60) {
        Write-Host "    Admin frontend is ready at http://127.0.0.1:3000" -ForegroundColor Green
    }
} else {
    Write-Host "[ERROR] Admin frontend directory not found: $adminPath" -ForegroundColor Red
}

# 3. Start Employee Frontend
Write-Host ""
Write-Host "3. Starting Employee Frontend (Next.js)..." -ForegroundColor Cyan
$employeePath = "frontend\employee"
if (Test-Path $employeePath) {
    $employeeProcess = Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PWD\$employeePath'; Write-Host 'Starting Employee Frontend...' -ForegroundColor Cyan; `$env:NODE_OPTIONS='--max-old-space-size=2048'; npm run start" -PassThru -WindowStyle Minimized
    Write-Host "[OK] Employee frontend process started (PID: $($employeeProcess.Id))" -ForegroundColor Green
    Write-Host "    Waiting for employee frontend to be ready..." -ForegroundColor Yellow
    if (Wait-ForService -ServiceName "Employee Frontend" -Port 3001 -MaxWaitSeconds 60) {
        Write-Host "    Employee frontend is ready at http://127.0.0.1:3001" -ForegroundColor Green
    }
} else {
    Write-Host "[ERROR] Employee frontend directory not found: $employeePath" -ForegroundColor Red
}

# 4. Start Caddy Reverse Proxy
Write-Host ""
Write-Host "4. Starting Caddy Reverse Proxy..." -ForegroundColor Cyan
if (Test-Path ".\caddy.exe") {
    $caddyProcess = Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PWD'; Write-Host 'Starting Caddy Reverse Proxy...' -ForegroundColor Cyan; .\caddy.exe run --config .\Caddyfile" -PassThru -WindowStyle Minimized
    Write-Host "[OK] Caddy process started (PID: $($caddyProcess.Id))" -ForegroundColor Green
    Write-Host "    Waiting for Caddy to be ready..." -ForegroundColor Yellow
    if (Wait-ForService -ServiceName "Caddy" -Port 8088 -MaxWaitSeconds 30) {
        Write-Host "    Caddy is ready at http://127.0.0.1:8088" -ForegroundColor Green
        Write-Host "    - Admin: http://127.0.0.1:8088/admin" -ForegroundColor Gray
        Write-Host "    - Employee: http://127.0.0.1:8088/employee" -ForegroundColor Gray
        Write-Host "    - API: http://127.0.0.1:8088/api" -ForegroundColor Gray
    }
} else {
    Write-Host "[ERROR] Caddy executable not found: .\caddy.exe" -ForegroundColor Red
}

# 5. Start Cloudflare Tunnel
Write-Host ""
Write-Host "5. Starting Cloudflare Tunnel..." -ForegroundColor Cyan
$cloudflared = Get-Command cloudflared -ErrorAction SilentlyContinue
if ($cloudflared) {
    $tunnelProcess = Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PWD'; Write-Host '========================================' -ForegroundColor Cyan; Write-Host 'Cloudflare Tunnel Starting...' -ForegroundColor Cyan; Write-Host '========================================' -ForegroundColor Cyan; Write-Host ''; Write-Host 'Your public URL will appear below:' -ForegroundColor Yellow; Write-Host ''; cloudflared tunnel --url http://127.0.0.1:8088" -PassThru
    Write-Host "[OK] Cloudflare tunnel process started (PID: $($tunnelProcess.Id))" -ForegroundColor Green
    Write-Host "    Waiting for tunnel to establish..." -ForegroundColor Yellow
    Start-Sleep -Seconds 8
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "[OK] All Services Started!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Check the Cloudflare Tunnel window for your public URL" -ForegroundColor Yellow
    Write-Host "   It will look like: https://xxxx-xxxx-xxxx.trycloudflare.com" -ForegroundColor White
    Write-Host ""
    Write-Host "Once you have the URL, access:" -ForegroundColor Cyan
    Write-Host "   - Admin:    https://YOUR-TUNNEL-URL/admin" -ForegroundColor White
    Write-Host "   - Employee: https://YOUR-TUNNEL-URL/employee" -ForegroundColor White
    Write-Host "   - API:      https://YOUR-TUNNEL-URL/api" -ForegroundColor White
    Write-Host ""
    Write-Host "All services are running in separate PowerShell windows" -ForegroundColor Gray
    Write-Host "   Close them individually to stop services" -ForegroundColor Gray
} else {
    Write-Host "[ERROR] Cloudflared not found. Please install it first:" -ForegroundColor Red
    Write-Host "   winget install -e --id Cloudflare.cloudflared" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[WARNING] Services started locally but no public tunnel:" -ForegroundColor Yellow
    Write-Host "   • Admin:    http://127.0.0.1:8088/admin" -ForegroundColor White
    Write-Host "   • Employee: http://127.0.0.1:8088/employee" -ForegroundColor White
    Write-Host "   • API:      http://127.0.0.1:8088/api" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

