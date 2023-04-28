@echo off
rem get parameters from user, namely $1 = release name, $2 = release version
set release_name=%1
set release_version=%2

if "%release_name%" == "" (
    echo ERROR: release name (first parameter) not set
    goto :eof
)

if "%release_version%" == "" (
    echo ERROR: release version (second parameter) not set
    goto :eof
)

if not "%release_version:~0,1%" == "v" (
    echo ERROR: release version (second parameter) must start with v
    goto :eof
)

echo %release_version% | findstr /r /c:"^v[0-9][0-9]*\.[0-9][0-9]*$" > nul
if errorlevel 1 (
    echo ERROR: release version (second parameter) must be of the form vXX.YY
    goto :eof
)

echo Creating release %release_name% %release_version%

echo %release_name% > RELEASENAME

git tag -a %release_version% -F RELEASENAME
git push origin %release_version%

echo Release %release_name% %release_version% created

:eof
