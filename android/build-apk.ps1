$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
Write-Host "JAVA_HOME set to: $env:JAVA_HOME"
.\gradlew.bat --info assembleDebug
