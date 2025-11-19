# Script to check Cloudflared tunnel status and show URL
Write-Host "=== Checking Cloudflared Tunnel Status ===" -ForegroundColor Cyan

$cloudflared = Get-Process -Name cloudflared -ErrorAction SilentlyContinue
if ($cloudflared) {
    Write-Host "[OK] Cloudflared is running (PID: $($cloudflared.Id))" -ForegroundColor Green
    Write-Host ""
    Write-Host "[INFO] To see the public URL, check the Cloudflared PowerShell window." -ForegroundColor Yellow
    Write-Host "       Look for a line that says:" -ForegroundColor Yellow
    Write-Host "       https://xxxx-xxxx-xxxx.trycloudflare.com" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "[ERROR] Cloudflared is NOT running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Starting Cloudflared tunnel supervisor..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit","-ExecutionPolicy","Bypass","-File","C:/Users/Administrator/Desktop/ATA-Senior-Project/scripts/start-cloudflared.ps1"
    Write-Host "Please wait 5-10 seconds for Cloudflared to establish connection..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Checking Reverse Proxy Status ===" -ForegroundColor Cyan
$caddy = Get-Process -Name caddy -ErrorAction SilentlyContinue
if ($caddy) {
    Write-Host "[OK] Caddy is running (PID: $($caddy.Id))" -ForegroundColor Green
    Write-Host "     Local URL: http://127.0.0.1:8088" -ForegroundColor White
    Write-Host "     - Admin: http://127.0.0.1:8088/admin" -ForegroundColor White
    Write-Host "     - Employee: http://127.0.0.1:8088/employee" -ForegroundColor White
    Write-Host "     - API: http://127.0.0.1:8088/api" -ForegroundColor White
} else {
    Write-Host "[ERROR] Caddy is NOT running" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Service Status ===" -ForegroundColor Cyan
$backend = Get-Process -Name java -ErrorAction SilentlyContinue | Select-Object -First 1
if ($backend) {
    Write-Host "[OK] Backend (Java) is running" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Backend is NOT running" -ForegroundColor Red
}

$admin = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($admin) {
    Write-Host "[OK] Admin Frontend is running on port 3000" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Admin Frontend is NOT running" -ForegroundColor Red
}

$employee = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($employee) {
    Write-Host "[OK] Employee Frontend is running on port 3001" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Employee Frontend is NOT running" -ForegroundColor Red
}
