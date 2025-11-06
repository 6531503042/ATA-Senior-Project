# Script to get the current Cloudflare tunnel URL
Write-Host "=== Getting Cloudflare Tunnel URL ===" -ForegroundColor Cyan
Write-Host ""

$cloudflared = Get-Process -Name cloudflared -ErrorAction SilentlyContinue
if (-not $cloudflared) {
    Write-Host "[ERROR] Cloudflared is not running!" -ForegroundColor Red
    Write-Host "Starting Cloudflared tunnel..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'C:\Users\Administrator\Desktop\ATA-Senior-Project'; cloudflared tunnel --url http://127.0.0.1:8088"
    Write-Host "Please wait 5-10 seconds and run this script again to see the URL." -ForegroundColor Yellow
    exit
}

Write-Host "[OK] Cloudflared is running (PID: $($cloudflared.Id))" -ForegroundColor Green
Write-Host ""
Write-Host "To get the current tunnel URL:" -ForegroundColor Yellow
Write-Host "1. Look for the PowerShell window titled 'Cloudflare Tunnel'" -ForegroundColor White
Write-Host "2. Find the line that says: https://xxxx-xxxx-xxxx.trycloudflare.com" -ForegroundColor White
Write-Host ""
Write-Host "Alternative: Check the Cloudflared process output manually" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== Current Configuration ===" -ForegroundColor Cyan
Write-Host "Local URLs:" -ForegroundColor White
Write-Host "  - Admin: http://127.0.0.1:8088/admin" -ForegroundColor Gray
Write-Host "  - Employee: http://127.0.0.1:8088/employee" -ForegroundColor Gray
Write-Host "  - API: http://127.0.0.1:8088/api" -ForegroundColor Gray
Write-Host ""
Write-Host "Public URLs (replace with your tunnel URL):" -ForegroundColor White
Write-Host "  - Admin: https://YOUR-TUNNEL-URL/admin" -ForegroundColor Gray
Write-Host "  - Employee: https://YOUR-TUNNEL-URL/employee" -ForegroundColor Gray
Write-Host "  - API: https://YOUR-TUNNEL-URL/api" -ForegroundColor Gray

