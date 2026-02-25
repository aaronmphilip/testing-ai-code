# install_node_and_setup.ps1
# Checks for Node.js, attempts to install via winget if missing, then installs project deps.
# Run as Administrator if you want the script to install Node via winget.

$root = "c:\Users\Astro\OneDrive\Desktop\Testing AI Code"
$apiDir = Join-Path $root 'api'
$webDir = Join-Path $root 'web'

function WriteErr($m){ Write-Host $m -ForegroundColor Red }
function WriteOk($m){ Write-Host $m -ForegroundColor Green }

Write-Host "Checking for Node.js..."
if (Get-Command node -ErrorAction SilentlyContinue) {
  WriteOk "Node is installed: $(node -v)"
} else {
  Write-Host "Node.js not found in PATH."
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "Attempting to install Node.js LTS via winget (requires admin)..."
    winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
    if ($LASTEXITCODE -ne 0) { WriteErr "winget install failed or was cancelled. Please install Node.js manually from https://nodejs.org/"; exit 1 }
    Start-Sleep -Seconds 3
  } else {
    WriteErr "winget not available. Please install Node.js LTS from https://nodejs.org and re-run this script.";
    exit 1
  }
}

# Ensure npm available
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  WriteErr "npm not found after installation. You may need to restart your shell or log out/in.";
  exit 1
}

# Install project dependencies
Write-Host "Installing backend dependencies..."
Push-Location $apiDir
npm install
Pop-Location

Write-Host "Installing frontend dependencies..."
Push-Location $webDir
npm install
Pop-Location

WriteOk "Dependencies installed. Use the start scripts in the scripts/ folder to run the servers: start-api.bat and start-web.bat"
Write-Host "Or run start-api.ps1 and start-web.ps1 from PowerShell (no admin required)."
