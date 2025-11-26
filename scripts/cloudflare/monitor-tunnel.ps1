# Cloudflare Tunnel Monitor & Auto-Restart
# This script monitors the tunnel and restarts it if it stops

param(
    [int]$CheckIntervalSeconds = 30,
    [int]$RestartDelaySeconds = 5
)

$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$LogDir = Join-Path $ProjectRoot "logs"
$LogFile = Join-Path $LogDir "cloudflared.log"
$UrlFile = Join-Path $LogDir "current-cloudflare-url.txt"

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
    exit 1
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Cloudflare Tunnel Monitor" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Check Interval: $CheckIntervalSeconds seconds" -ForegroundColor White
Write-Host "  Executable: $cloudflaredPath" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[INFO] Monitoring tunnel. Press Ctrl+C to stop." -ForegroundColor Yellow
Write-Host ""

function Start-Tunnel {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Starting tunnel..." -ForegroundColor Green
    
    $process = Start-Process -FilePath $cloudflaredPath -ArgumentList @(
        "tunnel",
        "--url", "http://127.0.0.1:8088",
        "--no-autoupdate",
        "--edge-ip-version", "auto",
        "--protocol", "http2",
        "--grace-period", "30s",
        "--loglevel", "info",
        "--logfile", $LogFile
    ) -PassThru -WindowStyle Minimized
    
    # Wait for URL
    Start-Sleep -Seconds 10
    if (Test-Path $LogFile) {
        $content = Get-Content $LogFile -Raw -ErrorAction SilentlyContinue
        if ($content -match 'https://([a-z0-9-]+)\.trycloudflare\.com') {
            $url = $matches[0]
            $url | Out-File -FilePath $UrlFile -Encoding utf8 -NoNewline -ErrorAction SilentlyContinue
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Tunnel URL: $url" -ForegroundColor Green
        }
    }
    
    return $process
}

function Check-Tunnel {
    $process = Get-Process cloudflared -ErrorAction SilentlyContinue
    if ($process) {
        return $true
    }
    return $false
}

# Start initial tunnel
$tunnelProcess = Start-Tunnel

# Monitor loop
while ($true) {
    try {
        if (-not (Check-Tunnel)) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Tunnel stopped! Restarting..." -ForegroundColor Yellow
            Start-Sleep -Seconds $RestartDelaySeconds
            $tunnelProcess = Start-Tunnel
        } else {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Tunnel is running ✓" -ForegroundColor Green
        }
        
        Start-Sleep -Seconds $CheckIntervalSeconds
    } catch {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Error: $_" -ForegroundColor Red
        Start-Sleep -Seconds $CheckIntervalSeconds
    }
}






