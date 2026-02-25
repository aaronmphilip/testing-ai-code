@echo off
cd /d "c:\Users\Astro\OneDrive\Desktop\Testing AI Code\api"
start powershell -NoExit -Command "cd 'c:\Users\Astro\OneDrive\Desktop\Testing AI Code\api'; if (Test-Path .\node_modules) { node index.js } else { npm install; node index.js }"
