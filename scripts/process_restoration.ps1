
$adminFile = "server/routes/admin.ts"
$chunks = @("scripts/restore_chunk1.txt", "scripts/restore_chunk2.txt", "scripts/restore_chunk3.txt", "scripts/restore_chunk4.txt")

$currentContent = Get-Content $adminFile
$newContent = @($currentContent)

foreach ($chunkFile in $chunks) {
    if (Test-Path $chunkFile) {
        $lines = Get-Content $chunkFile
        foreach ($line in $lines) {
            # Strip line number
            $cleanLine = $line -replace "^\d+:\s*", ""
            
            # De-space
            if ($cleanLine.Length -gt 0) {
                $chars = $cleanLine.ToCharArray()
                $deSpaced = ""
                # Take odd indices: 1, 3, 5...
                for ($i = 1; $i -lt $chars.Length; $i += 2) {
                    $deSpaced += $chars[$i]
                }
                $newContent += $deSpaced
            }
            else {
                $newContent += ""
            }
        }
    }
    else {
        Write-Host "Chunk file not found: $chunkFile"
    }
}

$newContent | Set-Content $adminFile
Write-Host "Restoration complete."
