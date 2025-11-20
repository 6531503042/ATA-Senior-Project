param(
    [string]$ConfigFile = "cloudflare-config.yml",
    [int]$RestartDelaySeconds = 5
)

function Resolve-CloudflaredPath {
    $localExe = Join-Path -Path (Get-Location) -ChildPath "cloudflared.exe"
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
    Write-Host "[ERROR] cloudflared executable not found. Install it or place cloudflared.exe in the repo root." -ForegroundColor Red
    exit 1
}

$rootDir = Split-Path -Parent $PSScriptRoot
$logDir = Join-Path $rootDir "logs"
if (-not (Test-Path $logDir)) {
    New-Item -Path $logDir -ItemType Directory | Out-Null
}
$logFile = Join-Path $logDir "cloudflared.log"
$configPath = Join-Path $rootDir $ConfigFile

if (-not (Test-Path $configPath)) {
    Write-Host "[ERROR] Config file not found: $configPath" -ForegroundColor Red
    Write-Host "Please create cloudflare-config.yml in the repo root. See CLOUDFLARE_NAMED_TUNNEL_SETUP.md for details." -ForegroundColor Yellow
    exit 1
}

Write-Host "============================================"
Write-Host "  Cloudflared Named Tunnel Wrapper"
Write-Host "  Executable : $cloudflaredPath"
Write-Host "  Config     : $configPath"
Write-Host "  Log file   : $logFile"
Write-Host "============================================"
Write-Host ""

function Start-Cloudflared {
    param(
        [string]$Executable,
        [string[]]$BaseArgs
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Launching cloudflared..." -ForegroundColor Cyan
    & $Executable @BaseArgs
    return $LASTEXITCODE
}

$baseArgs = @(
    "tunnel",
    "--config", $configPath,
    "--no-autoupdate",
    "--loglevel", "info",
    "--logfile", $logFile,
    "run"
)

while ($true) {
    $exitCode = Start-Cloudflared -Executable $cloudflaredPath -BaseArgs $baseArgs

    if ($exitCode -eq 0) {
        Write-Host "[INFO] cloudflared exited gracefully. Restarting in $RestartDelaySeconds second(s)..." -ForegroundColor Yellow
    } else {
        Write-Host "[WARN] cloudflared exited with code $exitCode. Restarting in $RestartDelaySeconds second(s)..." -ForegroundColor Yellow
    }

    Start-Sleep -Seconds $RestartDelaySeconds
}

