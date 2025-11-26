# Cloudflare Quick Tunnel Starter (Temporary URL)
# This script runs a quick tunnel for testing (URL changes on restart)

param(
    [string]$TunnelUrl = "http://127.0.0.1:8088",
    [int]$RestartDelaySeconds = 5
)

$ErrorActionPreference = "Stop"

# Get script directory and project root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$LogDir = Join-Path $ProjectRoot "logs"
$LogFile = Join-Path $LogDir "cloudflared.log"
$UrlFile = Join-Path $LogDir "current-cloudflare-url.txt"

# Create directories if they don't exist
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

# Find cloudflared executable
function Resolve-CloudflaredPath {
    $localExe = Join-Path -Path $ProjectRoot -ChildPath "cloudflared.exe"
    if (Test-Path $localExe) {
        return $localExe
    }

    $pathExe = Get-Command cloudflared -ErrorAction SilentlyContinue
    if ($pathExe) {
        return $pathExe.Source
    }

    return $null
}

$cloudflaredPath = Resolve-CloudflaredPath
if (-not $cloudflaredPath) {
    Write-Host "[ERROR] cloudflared executable not found!" -ForegroundColor Red
    Write-Host "Please install cloudflared:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://github.com/cloudflare/cloudflared/releases" -ForegroundColor Yellow
    Write-Host "  2. Place cloudflared.exe in project root" -ForegroundColor Yellow
    exit 1
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Cloudflare Quick Tunnel (Temporary)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Tunnel URL  : $TunnelUrl" -ForegroundColor White
Write-Host "  Log File    : $LogFile" -ForegroundColor White
Write-Host "  Executable  : $cloudflaredPath" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[NOTE] This is a QUICK tunnel - URL will change on restart!" -ForegroundColor Yellow
Write-Host "[TIP] For static domain, use: scripts\cloudflare\start-named-tunnel.ps1" -ForegroundColor Yellow
Write-Host ""

function Start-Cloudflared {
    param(
        [string]$Executable,
        [string[]]$BaseArgs
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Starting cloudflared tunnel..." -ForegroundColor Green
    
    & $Executable @BaseArgs
    return $LASTEXITCODE
}

function Save-CloudflareUrl {
    if (Test-Path $LogFile) {
        $content = Get-Content $LogFile -Raw -ErrorAction SilentlyContinue
        if ($content -match 'https://([a-z0-9-]+)\.trycloudflare\.com') {
            $url = $matches[0]
            $url | Out-File -FilePath $UrlFile -Encoding utf8 -NoNewline -ErrorAction SilentlyContinue
            Write-Host "[INFO] Tunnel URL: $url" -ForegroundColor Green
            Write-Host "[INFO] URL saved to: $UrlFile" -ForegroundColor Green
            return $url
        }
    }
    return $null
}

$baseArgs = @(
    "tunnel",
    "--url", $TunnelUrl,
    "--no-autoupdate",
    "--edge-ip-version", "auto",
    "--protocol", "http2",
    "--grace-period", "30s",
    "--loglevel", "info",
    "--logfile", $LogFile
)

# Wait for initial URL
Write-Host "[INFO] Waiting for tunnel URL..." -ForegroundColor Yellow
$initialWait = 0
while ($initialWait -lt 30) {
    Start-Sleep -Seconds 2
    $url = Save-CloudflareUrl
    if ($url) {
        break
    }
    $initialWait += 2
}

# Main loop with auto-restart
while ($true) {
    try {
        $exitCode = Start-Cloudflared -Executable $cloudflaredPath -BaseArgs $baseArgs

        if ($exitCode -eq 0) {
            Write-Host "[INFO] Tunnel exited gracefully. Restarting in $RestartDelaySeconds second(s)..." -ForegroundColor Yellow
        } else {
            Write-Host "[WARN] Tunnel exited with code $exitCode. Restarting in $RestartDelaySeconds second(s)..." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[ERROR] Exception occurred: $_" -ForegroundColor Red
        Write-Host "[INFO] Restarting in $RestartDelaySeconds second(s)..." -ForegroundColor Yellow
    }

    # Try to save URL after restart
    Start-Sleep -Seconds 3
    Save-CloudflareUrl | Out-Null

    Start-Sleep -Seconds $RestartDelaySeconds
}






