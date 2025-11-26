# Cloudflare Tunnel Agent - Auto Start & Monitor
# This script starts the tunnel and monitors it automatically

param(
    [switch]$Named,
    [switch]$Quick,
    [string]$TunnelName = "ata-app"
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Cloudflare Tunnel Agent" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if tunnel is already running
$existingProcess = Get-Process cloudflared -ErrorAction SilentlyContinue
if ($existingProcess) {
    Write-Host "[WARN] Tunnel is already running (PID: $($existingProcess.Id))" -ForegroundColor Yellow
    Write-Host "[INFO] Stopping existing tunnel..." -ForegroundColor Yellow
    Stop-Process -Name cloudflared -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Determine tunnel type
if ($Named) {
    Write-Host "[INFO] Starting Named Tunnel (Static Domain)..." -ForegroundColor Green
    Write-Host ""
    & "$ScriptDir\start-named-tunnel.ps1" -TunnelName $TunnelName
} elseif ($Quick) {
    Write-Host "[INFO] Starting Quick Tunnel (Temporary URL)..." -ForegroundColor Yellow
    Write-Host ""
    & "$ScriptDir\start-quick-tunnel.ps1"
} else {
    # Check if named tunnel is configured
    $configFile = Join-Path $ProjectRoot "config\cloudflare\config.yml"
    $credentialsFile = Join-Path $ProjectRoot "config\cloudflare\credentials.json"
    
    if ((Test-Path $configFile) -and (Test-Path $credentialsFile)) {
        Write-Host "[INFO] Named tunnel config found. Starting Named Tunnel..." -ForegroundColor Green
        Write-Host ""
        & "$ScriptDir\start-named-tunnel.ps1" -TunnelName $TunnelName
    } else {
        Write-Host "[INFO] No named tunnel config found. Starting Quick Tunnel..." -ForegroundColor Yellow
        Write-Host "[TIP] For static domain, setup named tunnel: docs\cloudflare\SETUP_NAMED_TUNNEL.md" -ForegroundColor Cyan
        Write-Host ""
        & "$ScriptDir\start-quick-tunnel.ps1"
    }
}






