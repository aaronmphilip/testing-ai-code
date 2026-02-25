# start-web.ps1 — runs frontend dev server in this terminal
Set-Location "c:\Users\Astro\OneDrive\Desktop\Testing AI Code\web"
if (-not (Test-Path "node_modules")) { npm install }
Write-Host "Starting ForgeHub web UI (Vite)..."
npm run dev
