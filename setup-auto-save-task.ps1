# This script sets up a scheduled task to auto-save your project to GitHub every 30 minutes

# Get the current directory where the script is located
$scriptPath = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
$autoSaveScript = Join-Path -Path $scriptPath -ChildPath "auto-save-to-github.bat"

# Task name and description
$taskName = "HukieReactAutoSave"
$taskDescription = "Automatically saves Hukie React project to GitHub every 30 minutes"

# Create a new scheduled task action
$action = New-ScheduledTaskAction -Execute $autoSaveScript

# Create a trigger that runs every 30 minutes
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 30) -RepetitionDuration ([TimeSpan]::MaxValue)

# Set the principal (user context) to run with highest privileges
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType S4U -RunLevel Highest

# Create the scheduled task
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable

# Register the scheduled task
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description $taskDescription -Force

Write-Host "Scheduled task '$taskName' has been created successfully."
Write-Host "Your project will be automatically saved to GitHub every 30 minutes."
Write-Host "Note: Make sure you've connected your repository to GitHub first by running connect-to-github.bat"
