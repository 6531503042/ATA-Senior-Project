param(
  [int]$Port = 8088,
  [string]$Subdomain = "ata-portal",
  [switch]$PrintRequests
)

Write-Host "Starting LocalTunnel on port $Port (subdomain: $Subdomain)" -ForegroundColor Cyan
$args = @("localtunnel","--port", $Port.ToString(), "--subdomain", $Subdomain)
if ($PrintRequests) { $args += "--print-requests" }

Start-Process -WindowStyle Normal powershell -ArgumentList "-NoExit","-Command","npx $($args -join ' ')"

Write-Host "A new window should open. Keep it running to stay online." -ForegroundColor Yellow

