# Get Current Cloudflare Tunnel URL

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$UrlFile = Join-Path $ProjectRoot "logs\current-cloudflare-url.txt"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Cloudflare Tunnel URL" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $UrlFile) {
    $url = Get-Content $UrlFile -Raw
    Write-Host "Current URL: $url" -ForegroundColor Green
    Write-Host ""
    Write-Host "Endpoints:" -ForegroundColor Yellow
    Write-Host "  - Admin:    $url/admin" -ForegroundColor White
    Write-Host "  - Employee: $url/employee" -ForegroundColor White
    Write-Host "  - API:      $url/api" -ForegroundColor White
} else {
    Write-Host "[WARN] URL file not found: $UrlFile" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "The tunnel might not be running or URL hasn't been captured yet." -ForegroundColor Yellow
    Write-Host "Check logs: logs\cloudflared.log" -ForegroundColor Yellow
}

Write-Host ""






