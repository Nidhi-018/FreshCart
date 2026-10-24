# Maven Wrapper PowerShell script
$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$JavaCmd = if ($env:JAVA_HOME) { Join-Path $env:JAVA_HOME 'bin\java.exe' } else { 'java' }
$JarPath = Join-Path $ScriptDir '.mvn\wrapper\maven-wrapper.jar'

& $JavaCmd "-Dmaven.multiModuleProjectDirectory=$ScriptDir" -cp $JarPath org.apache.maven.wrapper.MavenWrapperMain $args
exit $LASTEXITCODE
