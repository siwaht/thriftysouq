
$adminFile = "server/routes/admin.ts"
$chunks = @("scripts/restore_chunk1.txt", "scripts/restore_chunk2.txt", "scripts/restore_chunk3.txt", "scripts/restore_chunk4.txt")

# Keep the valid part of the file (first 334 lines)
$validContent = Get-Content $adminFile -TotalCount 334
$newContent = @($validContent)

foreach ($chunkFile in $chunks) {
    if (Test-Path $chunkFile) {
        $lines = Get-Content $chunkFile
        foreach ($line in $lines) {
            # Strip line number and leading whitespace
            $cleanLine = $line -replace "^\d+:\s*", ""
            
            # De-space
            if ($cleanLine.Length -gt 0) {
                $chars = $cleanLine.ToCharArray()
                $deSpaced = ""
                # Take even indices: 0, 2, 4...
                for ($i = 0; $i -lt $chars.Length; $i += 2) {
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
