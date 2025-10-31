param()

$ErrorActionPreference = 'Stop'

$root = (Resolve-Path "..\").Path
Write-Host "Repo root: $root"

Write-Host "Starting services... logs will appear in each spawned window" -ForegroundColor Green

# Backend (Spring Boot)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `$root/Backend/main; `$env:JAVA_HOME='C:\jdk-17.0.2'; ./gradlew.bat bootRun" -WindowStyle Normal

# Admin
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `$root/frontend/admin; bun install; bun run build; bun run start -p 3000" -WindowStyle Normal

# Employee
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `$root/frontend/employee; bun install; bun run build; bun run start -p 3001" -WindowStyle Normal

Write-Host "Health checks:" -ForegroundColor Cyan
Write-Host "API     : http://localhost:8080/actuator/health"
Write-Host "Admin   : http://localhost:3000/admin"
Write-Host "Employee: http://localhost:3001/employee"
