param(
    [string]$TunnelUrl = "http://127.0.0.1:8088",
    [AllowEmptyString()][string]$PreferredHostname = "",
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

Write-Host "============================================"
Write-Host "  Cloudflared Auto-Restart Wrapper"
Write-Host "  Executable : $cloudflaredPath"
Write-Host "  Tunnel URL : $TunnelUrl"
if ($PreferredHostname) {
    Write-Host "  Preferred Hostname : $PreferredHostname (requires a named tunnel with DNS access)"
} else {
    Write-Host "  Preferred Hostname : <not set - random *.trycloudflare.com will be used>"
}
Write-Host "  Log file  : $logFile"
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
    "--url", $TunnelUrl,
    "--no-autoupdate",
    "--edge-ip-version", "auto",
    "--protocol", "http2",
    "--grace-period", "30s",
    "--metrics", "127.0.0.1:20241",
    "--loglevel", "info",
    "--logfile", $logFile
)

if ($PreferredHostname) {
    $baseArgs += @("--hostname", $PreferredHostname)
}

while ($true) {
    $exitCode = Start-Cloudflared -Executable $cloudflaredPath -BaseArgs $baseArgs

    if ($exitCode -eq 0) {
        Write-Host "[INFO] cloudflared exited gracefully. Restarting in $RestartDelaySeconds second(s)..." -ForegroundColor Yellow
    } else {
        Write-Host "[WARN] cloudflared exited with code $exitCode. Restarting in $RestartDelaySeconds second(s)..." -ForegroundColor Yellow
    }

    Start-Sleep -Seconds $RestartDelaySeconds
}

