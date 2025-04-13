# Auto-Save to GitHub Setup Instructions

This document explains how to set up automatic saving of your Hukie React project to GitHub every 30 minutes.

## Prerequisites

1. Git installed on your computer
2. A GitHub account
3. Your project already initialized as a Git repository (which has been done)

## Setup Steps

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in to your account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., "hukie-react")
4. Add a description (optional)
5. Choose whether to make it public or private
6. Do NOT initialize with a README, .gitignore, or license (since we already have these files locally)
7. Click "Create repository"

### 2. Connect Your Local Repository to GitHub

1. After creating the repository, GitHub will show you the repository URL
2. Edit the `connect-to-github.bat` file in your project directory:
   - Replace `https://github.com/yourusername/hukie-react.git` with your actual repository URL
3. Run the `connect-to-github.bat` script:
   ```
   .\connect-to-github.bat
   ```
4. Enter your GitHub credentials when prompted

### 3. Set Up the Auto-Save Task

1. Run PowerShell as Administrator
2. Navigate to your project directory
3. Run the setup script:
   ```
   .\setup-auto-save-task.ps1
   ```
4. This will create a scheduled task that runs every 30 minutes to save your changes to GitHub

## How It Works

The auto-save system consists of two main components:

1. **auto-save-to-github.bat**: This script:
   - Adds all changes to the staging area
   - Commits them with a timestamp
   - Pushes the changes to GitHub
   
2. **Scheduled Task**: A Windows scheduled task that runs the script every 30 minutes

## Verifying the Setup

1. To verify that the scheduled task was created:
   - Open Task Scheduler (search for it in the Start menu)
   - Look for the "HukieReactAutoSave" task
   
2. To verify that the auto-save is working:
   - Make some changes to your project
   - Wait for the next scheduled run (or run the script manually)
   - Check your GitHub repository to see if the changes were pushed

## Troubleshooting

If the auto-save is not working:

1. Make sure you've connected your repository to GitHub by running `connect-to-github.bat`
2. Check that the scheduled task is enabled and running
3. Try running `auto-save-to-github.bat` manually to see if there are any errors
4. Ensure you have a stable internet connection

## Modifying the Schedule

If you want to change how often the auto-save runs:

1. Open Task Scheduler
2. Find and right-click on the "HukieReactAutoSave" task
3. Select "Properties"
4. Go to the "Triggers" tab
5. Edit the trigger to change the repetition interval

## Disabling Auto-Save

If you want to temporarily disable the auto-save:

1. Open Task Scheduler
2. Find the "HukieReactAutoSave" task
3. Right-click and select "Disable"

To re-enable it later, follow the same steps but select "Enable" instead.
