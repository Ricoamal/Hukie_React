#!/bin/bash

# Auto-save script for Hukie React project
# This script commits and pushes changes to GitHub

# Change to the project directory (if running from a different location)
# cd /path/to/your/project

# Get current date and time for commit message
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Add all changes
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "No changes to commit at $TIMESTAMP"
else
    # Commit changes with timestamp
    git commit -m "Auto-save: $TIMESTAMP"
    
    # Push to GitHub
    git push
    
    echo "Changes committed and pushed to GitHub at $TIMESTAMP"
fi

echo "Auto-save complete."
