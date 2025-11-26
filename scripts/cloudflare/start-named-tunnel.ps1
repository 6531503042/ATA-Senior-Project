# Cloudflare Named Tunnel Starter
# This script runs a Cloudflare Named Tunnel with static domain

param(
    [string]$TunnelName = "ata-app",
    [int]$RestartDelaySeconds = 5
)

$ErrorActionPreference = "Stop"

# Get script directory and project root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$ConfigDir = Join-Path $ProjectRoot "config\cloudflare"
$ConfigFile = Join-Path $ConfigDir "config.yml"
$LogDir = Join-Path $ProjectRoot "logs"
$LogFile = Join-Path $LogDir "cloudflared.log"

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
    Write-Host "  3. Or install globally: choco install cloudflared" -ForegroundColor Yellow
    exit 1
}

# Check if config file exists
if (-not (Test-Path $ConfigFile)) {
    Write-Host "[ERROR] Config file not found: $ConfigFile" -ForegroundColor Red
    Write-Host "" -ForegroundColor Yellow
    Write-Host "Please setup your tunnel first:" -ForegroundColor Yellow
    Write-Host "  1. Copy config\cloudflare\config.yml.template to config\cloudflare\config.yml" -ForegroundColor Yellow
    Write-Host "  2. Follow the guide: docs\cloudflare\SETUP_NAMED_TUNNEL.md" -ForegroundColor Yellow
    exit 1
}

# Check if credentials file exists
$configContent = Get-Content $ConfigFile -Raw
if ($configContent -match 'credentials-file:\s*(.+)') {
    $credentialsPath = $matches[1].Trim()
    # Resolve relative path
    if (-not [System.IO.Path]::IsPathRooted($credentialsPath)) {
        $credentialsPath = Join-Path $ConfigDir $credentialsPath
    }
    
    if (-not (Test-Path $credentialsPath)) {
        Write-Host "[ERROR] Credentials file not found: $credentialsPath" -ForegroundColor Red
        Write-Host "" -ForegroundColor Yellow
        Write-Host "Please create your tunnel first:" -ForegroundColor Yellow
        Write-Host "  1. Run: cloudflared.exe tunnel create $TunnelName" -ForegroundColor Yellow
        Write-Host "  2. Copy credentials.json to config\cloudflare\" -ForegroundColor Yellow
        Write-Host "  3. Update config.yml with correct path" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Cloudflare Named Tunnel" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Tunnel Name  : $TunnelName" -ForegroundColor White
Write-Host "  Config File  : $ConfigFile" -ForegroundColor White
Write-Host "  Log File     : $LogFile" -ForegroundColor White
Write-Host "  Executable   : $cloudflaredPath" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
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

$baseArgs = @(
    "tunnel",
    "--config", $ConfigFile,
    "--no-autoupdate",
    "--loglevel", "info",
    "--logfile", $LogFile,
    "run", $TunnelName
)

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

    Start-Sleep -Seconds $RestartDelaySeconds
}






