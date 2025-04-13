@echo off
echo Auto-saving changes to GitHub...

REM Change to the project directory
cd /d "%~dp0"

REM Get current date and time for commit message
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

REM Add all changes
git add .

REM Check if there are changes to commit
git diff --cached --quiet
if %ERRORLEVEL% NEQ 0 (
    REM Commit changes with timestamp
    git commit -m "Auto-save: %timestamp%"
    
    REM Push to GitHub
    git push
    
    echo Changes committed and pushed to GitHub at %timestamp%
) else (
    echo No changes to commit at %timestamp%
)

echo Auto-save complete.
