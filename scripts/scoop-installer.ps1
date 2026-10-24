$cmd = @(
    '@echo off',
    'set LOGISTER_INSTALL_SOURCE=scoop',
    'node "%~dp0bin\logister.js" %*'
)
Set-Content "$dir\logister.cmd" ($cmd -join "`r`n") -Encoding ASCII
