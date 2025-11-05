# Script to start Cloudflared tunnel with Windows Defender exception
Write-Host "=== Starting Cloudflared Tunnel ===" -ForegroundColor Cyan
Write-Host ""

# Check if cloudflared.exe exists
if (-not (Test-Path ".\cloudflared.exe")) {
    Write-Host "[ERROR] cloudflared.exe not found!" -ForegroundColor Red
    Write-Host "Downloading cloudflared..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"
    Write-Host "[OK] Download complete" -ForegroundColor Green
}

# Try to add Windows Defender exception (requires admin)
Write-Host "Attempting to add Windows Defender exception..." -ForegroundColor Yellow
$currentPath = (Get-Location).Path
$exePath = Join-Path $currentPath "cloudflared.exe"

try {
    # This requires admin privileges
    Add-MpPreference -ExclusionPath $currentPath -ErrorAction SilentlyContinue
    Write-Host "[OK] Added exclusion (may require admin)" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Could not add exclusion automatically" -ForegroundColor Yellow
    Write-Host "Please manually add exclusion in Windows Security:" -ForegroundColor Yellow
    Write-Host "  1. Open Windows Security" -ForegroundColor White
    Write-Host "  2. Virus & threat protection > Manage settings" -ForegroundColor White
    Write-Host "  3. Exclusions > Add or remove exclusions" -ForegroundColor White
    Write-Host "  4. Add folder: $currentPath" -ForegroundColor White
}

Write-Host ""
Write-Host "Starting Cloudflared tunnel to http://127.0.0.1:8088..." -ForegroundColor Cyan
Write-Host "The public URL will appear below:" -ForegroundColor Yellow
Write-Host ""

# Start cloudflared
& ".\cloudflared.exe" tunnel --url http://127.0.0.1:8088

