# Auto-save script for Hukie React project
# This script commits and pushes changes to GitHub

# Change to the project directory (if running from a different location)
# Set-Location -Path "C:\path\to\your\project"

# Get current date and time for commit message
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Add all changes
git add .

# Check if there are changes to commit
$hasChanges = git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "No changes to commit at $timestamp"
} else {
    # Commit changes with timestamp
    git commit -m "Auto-save: $timestamp"
    
    # Push to GitHub
    git push
    
    Write-Host "Changes committed and pushed to GitHub at $timestamp"
}

Write-Host "Auto-save complete."
