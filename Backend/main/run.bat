@echo off
set JAVA_HOME=C:\jdk-17.0.2
set PATH=%JAVA_HOME%\bin;%PATH%
echo Starting Spring Boot application...
gradlew.bat bootRun
