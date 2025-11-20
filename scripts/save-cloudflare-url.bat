@echo off
REM Extract Cloudflare URL from log file and save to URL file
setlocal ENABLEDELAYEDEXPANSION

set "LOG_FILE=logs\cloudflared.log"
set "URL_FILE=logs\current-cloudflare-url.txt"

if not exist "%LOG_FILE%" (
    echo Log file not found: %LOG_FILE%
    exit /b 1
)

REM Extract URL from log (look for "https://*.trycloudflare.com")
findstr /C:"https://" "%LOG_FILE%" | findstr /C:"trycloudflare.com" > "%TEMP%\urls.tmp"

if exist "%TEMP%\urls.tmp" (
    REM Get the last URL found
    for /f "tokens=*" %%a in ('type "%TEMP%\urls.tmp"') do set "LAST_URL=%%a"
    
    REM Extract just the URL part
    for /f "tokens=*" %%a in ('echo !LAST_URL! ^| findstr /R "https://[a-z0-9-]*\.trycloudflare\.com"') do (
        for /f "tokens=* delims= " %%b in ("%%a") do (
            echo %%b | findstr /R "https://[a-z0-9-]*\.trycloudflare\.com" > "%URL_FILE%"
        )
    )
    
    REM Try alternative extraction
    if not exist "%URL_FILE%" (
        echo !LAST_URL! | findstr /R "https://[a-z0-9-]*\.trycloudflare\.com" > "%URL_FILE%"
    )
    
    if exist "%URL_FILE%" (
        echo Cloudflare URL saved to: %URL_FILE%
        type "%URL_FILE%"
    ) else (
        echo Could not extract URL from log
    )
    
    del "%TEMP%\urls.tmp" 2>nul
) else (
    echo No Cloudflare URL found in log file
    exit /b 1
)

