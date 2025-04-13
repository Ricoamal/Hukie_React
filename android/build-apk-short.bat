@echo off
set JAVA_HOME=C:\PROGRA~1\Java\jdk-17.0.10
echo Using Java home: %JAVA_HOME%
call gradlew.bat assembleDebug
