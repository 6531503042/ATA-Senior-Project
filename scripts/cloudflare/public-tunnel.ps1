$ErrorActionPreference = 'Stop'

$bin = Join-Path (Resolve-Path "..\").Path "bin"
New-Item -ItemType Directory -Force -Path $bin | Out-Null

$cf = Join-Path $bin "cloudflared.exe"
if (-not (Test-Path $cf)) {
	Write-Host "Downloading cloudflared..."
	Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile $cf
}

Write-Host "Starting tunnel to http://localhost:8088 ..."
& $cf tunnel --url http://localhost:8088
