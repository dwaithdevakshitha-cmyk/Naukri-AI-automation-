Get-Process | ForEach-Object {
    if ($_.MainWindowTitle) {
        Write-Host "$($_.Id) | $($_.ProcessName) | $($_.MainWindowTitle)"
    }
}
