@echo off
cd /d "c:\Users\Astro\OneDrive\Desktop\Testing AI Code\web"
start powershell -NoExit -Command "cd 'c:\Users\Astro\OneDrive\Desktop\Testing AI Code\web'; if (Test-Path .\node_modules) { npm run dev } else { npm install; npm run dev }"
