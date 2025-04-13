@echo off
echo Connecting to GitHub repository...

REM Replace the URL below with your actual GitHub repository URL
set GITHUB_REPO_URL=https://github.com/yourusername/hukie-react.git

REM Add the remote repository
git remote add origin %GITHUB_REPO_URL%

REM Push the code to GitHub
git push -u origin master

echo Repository connected and code pushed to GitHub.
echo You can now use 'git push' to update the remote repository.
