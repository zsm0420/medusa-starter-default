@echo off
REM Medusa Deployment Verification Script (Windows)
REM 用法: verify-deployment.bat [backend-url] [admin-url] [storefront-url]

setlocal

set BACKEND_URL=%1
if "%BACKEND_URL%"=="" set BACKEND_URL=http://localhost:9000

set ADMIN_URL=%2
if "%ADMIN_URL%"=="" set ADMIN_URL=http://localhost:5173

set STOREFRONT_URL=%3
if "%STOREFRONT_URL%"=="" set STOREFRONT_URL=http://localhost:3000

echo ==========================================
echo Medusa Deployment Verification
echo ==========================================
echo.
echo Backend URL: %BACKEND_URL%
echo Admin URL: %ADMIN_URL%
echo Storefront URL: %STOREFRONT_URL%
echo.

echo -----------------------------------------
echo 1. Backend Health Check
echo -----------------------------------------
echo Checking health endpoint...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" %BACKEND_URL%/health

echo.
echo -----------------------------------------
echo 2. Store API Check
echo -----------------------------------------
echo Checking products API...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" %BACKEND_URL%/store/products

echo.
echo -----------------------------------------
echo 3. Admin API Check
echo -----------------------------------------
echo Checking admin auth API...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" %BACKEND_URL%/admin/auth

echo.
echo ==========================================
echo Deployment Status Report
echo ==========================================
echo.
echo Date: %date% %time%
echo Backend: %BACKEND_URL%
echo.
echo Next Steps:
echo 1. If all checks passed, deployment is successful
echo 2. Create admin user: npx medusa user -e admin@email.com -p password
echo 3. Login to Admin dashboard to configure your store
echo 4. Add products and configure payment/shipping providers
echo.

endlocal
pause
