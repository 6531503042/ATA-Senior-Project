# Main Cloudflare Tunnel Starter
# This script helps you choose between Named Tunnel (static) or Quick Tunnel (temporary)

param(
    [switch]$Quick,
    [switch]$Named,
    [string]$TunnelName = "ata-app"
)

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Cloudflare Tunnel Starter" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if ($Quick) {
    Write-Host "[INFO] Starting Quick Tunnel (Temporary URL)..." -ForegroundColor Yellow
    Write-Host ""
    & "$PSScriptRoot\start-quick-tunnel.ps1"
} elseif ($Named) {
    Write-Host "[INFO] Starting Named Tunnel (Static Domain)..." -ForegroundColor Green
    Write-Host ""
    & "$PSScriptRoot\start-named-tunnel.ps1" -TunnelName $TunnelName
} else {
    Write-Host "Please choose tunnel type:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  1. Named Tunnel (Static Domain) ⭐ Recommended for Production" -ForegroundColor Green
    Write-Host "     - URL doesn't change" -ForegroundColor White
    Write-Host "     - Requires Cloudflare account + domain" -ForegroundColor White
    Write-Host "     - Production ready" -ForegroundColor White
    Write-Host ""
    Write-Host "  2. Quick Tunnel (Temporary URL) - Testing Only" -ForegroundColor Yellow
    Write-Host "     - URL changes on restart" -ForegroundColor White
    Write-Host "     - No account needed" -ForegroundColor White
    Write-Host "     - For testing only" -ForegroundColor White
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\scripts\cloudflare\start-tunnel.ps1 -Named    # Named tunnel (static)" -ForegroundColor White
    Write-Host "  .\scripts\cloudflare\start-tunnel.ps1 -Quick    # Quick tunnel (temp)" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use scripts directly:" -ForegroundColor Cyan
    Write-Host "  .\scripts\cloudflare\start-named-tunnel.ps1   # Named tunnel" -ForegroundColor White
    Write-Host "  .\scripts\cloudflare\start-quick-tunnel.ps1   # Quick tunnel" -ForegroundColor White
    Write-Host ""
    Write-Host "For setup guide, see: docs\cloudflare\SETUP_NAMED_TUNNEL.md" -ForegroundColor Yellow
}






