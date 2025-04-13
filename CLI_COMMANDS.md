# CLI Commands for GitHub Auto-Save

This document provides CLI commands for setting up and managing the auto-save functionality for your Hukie React project.

## Connecting to GitHub

```bash
# Add the GitHub repository as a remote
git remote add origin https://github.com/yourusername/hukie-react.git

# Push your local repository to GitHub
git push -u origin master
```

Replace `yourusername/hukie-react.git` with your actual GitHub repository URL.

## Running Auto-Save Manually

### Using PowerShell:
```powershell
# Run the auto-save script
.\auto-save.ps1
```

### Using Bash (if you have Git Bash or WSL):
```bash
# Make the script executable (first time only)
chmod +x auto-save.sh

# Run the auto-save script
./auto-save.sh
```

## Managing the Scheduled Task

### Creating the Task (Windows):
```cmd
# Create a scheduled task to run every 30 minutes
schtasks /create /tn "HukieReactAutoSave" /tr "powershell.exe -ExecutionPolicy Bypass -File \"C:\path\to\auto-save.ps1\"" /sc minute /mo 30 /st 00:00 /ru "%USERNAME%" /rl highest /f
```

Replace `C:\path\to\auto-save.ps1` with the full path to your auto-save.ps1 file.

### Checking Task Status:
```cmd
# View details of the scheduled task
schtasks /query /tn "HukieReactAutoSave" /v
```

### Disabling the Task:
```cmd
# Disable the auto-save task
schtasks /change /tn "HukieReactAutoSave" /disable
```

### Enabling the Task:
```cmd
# Enable the auto-save task
schtasks /change /tn "HukieReactAutoSave" /enable
```

### Deleting the Task:
```cmd
# Delete the auto-save task
schtasks /delete /tn "HukieReactAutoSave" /f
```

## Checking Git Status

```bash
# Check if your repository is connected to GitHub
git remote -v

# Check the status of your local repository
git status

# View commit history
git log --oneline
```

## Troubleshooting

If you encounter issues with the auto-save:

```bash
# Check if you're authenticated with GitHub
git push

# If you get authentication errors, set up credential caching
git config --global credential.helper cache
git config --global credential.helper 'cache --timeout=3600'

# Or use a personal access token instead of password
git remote set-url origin https://yourusername:your_token@github.com/yourusername/hukie-react.git
```

Replace `yourusername`, `your_token`, and `hukie-react` with your actual GitHub username, personal access token, and repository name.
