@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-17
echo Using Java home: %JAVA_HOME%
call gradlew.bat assembleDebug
