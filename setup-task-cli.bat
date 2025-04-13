@echo off
REM This script sets up a scheduled task to run the auto-save script every 30 minutes

REM Get the full path to the auto-save script
set "SCRIPT_PATH=%~dp0auto-save.ps1"

REM Create a scheduled task
schtasks /create /tn "HukieReactAutoSave" /tr "powershell.exe -ExecutionPolicy Bypass -File \"%SCRIPT_PATH%\"" /sc minute /mo 30 /st 00:00 /ru "%USERNAME%" /rl highest /f

echo Scheduled task created. Your project will be automatically saved to GitHub every 30 minutes.
echo To verify, open Task Scheduler and look for the "HukieReactAutoSave" task.
