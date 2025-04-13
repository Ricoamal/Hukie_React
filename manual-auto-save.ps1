# This script provides a manual way to set up auto-save without requiring administrator privileges
# It creates a simple PowerShell script that can be run manually or added to Windows Task Scheduler

$scriptPath = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
$autoSaveScript = Join-Path -Path $scriptPath -ChildPath "auto-save.ps1"

Write-Host "Auto-save script is located at: $autoSaveScript"
Write-Host ""
Write-Host "To manually run the auto-save script:"
Write-Host "    .\auto-save.ps1"
Write-Host ""
Write-Host "To set up automatic saving every 30 minutes:"
Write-Host "1. Open Task Scheduler (search for it in the Start menu)"
Write-Host "2. Click 'Create Basic Task...'"
Write-Host "3. Name: 'HukieReactAutoSave'"
Write-Host "4. Description: 'Automatically saves Hukie React project to GitHub every 30 minutes'"
Write-Host "5. Trigger: 'Daily'"
Write-Host "6. Start time: Set to current time"
Write-Host "7. Recur every: '1 days'"
Write-Host "8. Action: 'Start a program'"
Write-Host "9. Program/script: 'powershell.exe'"
Write-Host "10. Add arguments: '-ExecutionPolicy Bypass -File `"$autoSaveScript`"'"
Write-Host "11. Click 'Finish'"
Write-Host ""
Write-Host "12. Find the task in the Task Scheduler Library"
Write-Host "13. Right-click on it and select 'Properties'"
Write-Host "14. Go to the 'Triggers' tab and click 'Edit'"
Write-Host "15. Check 'Repeat task every:' and set it to '30 minutes'"
Write-Host "16. Set 'for a duration of:' to 'Indefinitely'"
Write-Host "17. Click 'OK' and then 'OK' again"
Write-Host ""
Write-Host "Your project will now be automatically saved to GitHub every 30 minutes."

# Let's also run the auto-save script once to make sure it works
Write-Host ""
Write-Host "Running auto-save script now to test it..."
& $autoSaveScript
