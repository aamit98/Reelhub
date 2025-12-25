# Quick script to kill process on port 3000
$port = 3000
Write-Host "🔍 Checking port $port..." -ForegroundColor Cyan

$connection = netstat -ano | findstr ":$port.*LISTENING"
if ($connection) {
    $processId = ($connection -split '\s+')[-1]
    Write-Host "Found process PID: $processId" -ForegroundColor Yellow
    Write-Host "Killing process..." -ForegroundColor Cyan
    taskkill /F /PID $processId 2>$null
    Start-Sleep -Seconds 1
    Write-Host "✅ Port $port is now free!" -ForegroundColor Green
} else {
    Write-Host "✅ Port $port is already free!" -ForegroundColor Green
}

