# Wait for all services to be ready before starting Cloudflare tunnel
# This prevents 503 errors when services are not ready

$ErrorActionPreference = "Continue"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Waiting for Services to be Ready" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$maxWaitSeconds = 120
$checkInterval = 5
$elapsed = 0

function Test-Service {
    param($Name, $Url, $Port)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 3 -ErrorAction Stop
        return $true
    } catch {
        # Check if port is listening
        $listening = netstat -ano | findstr ":$Port" | Select-Object -First 1
        if ($listening) {
            return $true
        }
        return $false
    }
}

$services = @(
    @{ Name = "Backend"; Url = "http://127.0.0.1:8080/api/health"; Port = 8080 },
    @{ Name = "Admin Frontend"; Url = "http://127.0.0.1:3000/admin"; Port = 3000 },
    @{ Name = "Employee Frontend"; Url = "http://127.0.0.1:3001/employee/login"; Port = 3001 },
    @{ Name = "Caddy"; Url = "http://127.0.0.1:8088/admin"; Port = 8088 }
)

$ready = @{}

while ($elapsed -lt $maxWaitSeconds) {
    $allReady = $true
    
    foreach ($service in $services) {
        if (-not $ready[$service.Name]) {
            if (Test-Service -Name $service.Name -Url $service.Url -Port $service.Port) {
                Write-Host "  ✓ $($service.Name) is ready" -ForegroundColor Green
                $ready[$service.Name] = $true
            } else {
                $allReady = $false
            }
        }
    }
    
    if ($allReady) {
        Write-Host ""
        Write-Host "============================================" -ForegroundColor Green
        Write-Host "  All services are ready!" -ForegroundColor Green
        Write-Host "============================================" -ForegroundColor Green
        exit 0
    }
    
    Start-Sleep -Seconds $checkInterval
    $elapsed += $checkInterval
    Write-Host "  Waiting... ($elapsed/$maxWaitSeconds seconds)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Red
Write-Host "  Timeout waiting for services!" -ForegroundColor Red
Write-Host "============================================" -ForegroundColor Red
Write-Host ""
Write-Host "Services not ready:" -ForegroundColor Yellow
foreach ($service in $services) {
    if (-not $ready[$service.Name]) {
        Write-Host "  ✗ $($service.Name)" -ForegroundColor Red
    }
}
exit 1



