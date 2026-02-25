# start-api.ps1 — runs backend in this terminal
Set-Location "c:\Users\Astro\OneDrive\Desktop\Testing AI Code\api"
if (-not (Test-Path "node_modules")) { npm install }
Write-Host "Starting ForgeHub API on port 4000..."
node index.js
