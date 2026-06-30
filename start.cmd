@echo off
:: start.bat — indít egy helyi HTTP szervert és megnyitja a játékválasztót
:: Használat: start.bat [port]

set PORT=8765
if not "%~1"=="" set PORT=%~1

:: Az src/ mappa abszolút útja
set SERVE_DIR=%~dp0src

echo Szerver indul: http://localhost:%PORT%
echo Leallitashoz: Ctrl+C
echo.

:: Rövid várakozás, hogy a szerver elinduljon, majd böngésző megnyitása
start "" /b cmd /c "timeout /t 1 /nobreak >nul && start http://localhost:%PORT%"

:: Szerver indítása
cd /d "%SERVE_DIR%"
python -m http.server %PORT%
