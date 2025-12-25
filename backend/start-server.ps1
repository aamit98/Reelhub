# Script to kill port 3000 and start the server
Write-Host "🔍 Checking port 3000..." -ForegroundColor Cyan

$connection = netstat -ano | findstr ":3000.*LISTENING"
if ($connection) {
    $processId = ($connection -split '\s+')[-1]
    Write-Host "Found process on port 3000 (PID: $processId). Killing it..." -ForegroundColor Yellow
    taskkill /F /PID $processId 2>$null
    Start-Sleep -Seconds 2
}

Write-Host "`n🚀 Starting backend server...`n" -ForegroundColor Green
npm start


