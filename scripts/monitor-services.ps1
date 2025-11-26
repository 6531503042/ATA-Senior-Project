# Monitor Services and Auto-Restart
# This script monitors services and restarts them if they become unhealthy

$ErrorActionPreference = "Continue"

$checkInterval = 30  # Check every 30 seconds
$maxFailures = 3     # Restart after 3 consecutive failures
$failureCount = @{}

function Test-ServiceHealth {
    param($Name, $Url, $Port)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -ErrorAction Stop
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

function Restart-Service {
    param($Name, $Port)
    
    Write-Host "[$Name] Restarting service..." -ForegroundColor Yellow
    
    switch ($Name) {
        "Backend" {
            $process = Get-Process java -ErrorAction SilentlyContinue | Where-Object { (Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq 8080 }) }
            if ($process) {
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
            Start-Sleep -Seconds 2
            Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PWD\Backend\main'; .\gradlew.bat bootRun" -WindowStyle Minimized
        }
        "Admin Frontend" {
            $process = Get-Process node -ErrorAction SilentlyContinue | Where-Object { (Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq 3000 }) }
            if ($process) {
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
            Start-Sleep -Seconds 2
            Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PWD\frontend\admin'; `$env:NODE_OPTIONS='--max-old-space-size=2048'; npm run start" -WindowStyle Minimized
        }
        "Employee Frontend" {
            $process = Get-Process node -ErrorAction SilentlyContinue | Where-Object { (Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq 3001 }) }
            if ($process) {
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
            Start-Sleep -Seconds 2
            Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PWD\frontend\employee'; `$env:NODE_OPTIONS='--max-old-space-size=2048'; npm run start" -WindowStyle Minimized
        }
        "Caddy" {
            .\scripts\restart-caddy.ps1
        }
    }
    
    Start-Sleep -Seconds 5
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Service Monitor" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Monitoring services every $checkInterval seconds..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

$services = @(
    @{ Name = "Backend"; Url = "http://127.0.0.1:8080/api/health"; Port = 8080 },
    @{ Name = "Admin Frontend"; Url = "http://127.0.0.1:3000/admin"; Port = 3000 },
    @{ Name = "Employee Frontend"; Url = "http://127.0.0.1:3001/employee/login"; Port = 3001 },
    @{ Name = "Caddy"; Url = "http://127.0.0.1:8088/admin"; Port = 8088 }
)

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Checking services..." -ForegroundColor Cyan
    
    foreach ($service in $services) {
        $isHealthy = Test-ServiceHealth -Name $service.Name -Url $service.Url -Port $service.Port
        
        if ($isHealthy) {
            Write-Host "  ✓ $($service.Name) - Healthy" -ForegroundColor Green
            $failureCount[$service.Name] = 0
        } else {
            $failureCount[$service.Name] = ($failureCount[$service.Name] ?? 0) + 1
            Write-Host "  ✗ $($service.Name) - Unhealthy (Failures: $($failureCount[$service.Name]))" -ForegroundColor Red
            
            if ($failureCount[$service.Name] -ge $maxFailures) {
                Write-Host "  ⚠ $($service.Name) - Restarting after $maxFailures failures..." -ForegroundColor Yellow
                Restart-Service -Name $service.Name -Port $service.Port
                $failureCount[$service.Name] = 0
            }
        }
    }
    
    Write-Host ""
    Start-Sleep -Seconds $checkInterval
}



