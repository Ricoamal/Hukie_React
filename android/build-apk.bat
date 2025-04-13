@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-17.0.10
echo Using Java home: %JAVA_HOME%
cd %~dp0
call %~dp0gradlew.bat assembleDebug
