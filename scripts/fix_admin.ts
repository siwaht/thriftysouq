
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'server', 'routes', 'admin.ts');

function fixFile() {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        const fixedLines: string[] = [];
        let corruptionStarted = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Detect the start of corruption (after the updateMenuItemOrder line)
            if (line.includes('await storage.updateMenuItemOrder(id, newOrder);')) {
                fixedLines.push(line);
                corruptionStarted = true;
                continue;
            }

            if (corruptionStarted) {
                // Attempt to de-space the line
                // Strategy: Take every even-indexed character
                // But first, check if it actually looks spaced out
                // A heuristic: if it contains "r e s" or "t r y" or "c a t c h"
                if (line.match(/r e s|t r y|c a t c h|\}   c a t c h/)) {
                    let fixedLine = "";
                    for (let j = 0; j < line.length; j += 2) {
                        fixedLine += line[j];
                    }
                    fixedLines.push(fixedLine);
                } else if (line.trim() === '') {
                    fixedLines.push(line);
                } else {
                    // Fallback: if it doesn't match obvious keywords but is in the corrupted region,
                    // it might still be corrupted. 
                    // Let's look at the line. If it looks like "  ", it becomes " ".
                    // If it looks like "}", it might be "} " -> "}"

                    // Let's try to apply the even-index rule generally for this region
                    // providing the line length is even.
                    if (line.length % 2 === 0) {
                        let fixedLine = "";
                        for (let j = 0; j < line.length; j += 2) {
                            fixedLine += line[j];
                        }
                        fixedLines.push(fixedLine);
                    } else {
                        // Odd length, maybe trailing newline issue or something else.
                        // Try taking even chars anyway
                        let fixedLine = "";
                        for (let j = 0; j < line.length; j += 2) {
                            fixedLine += line[j];
                        }
                        fixedLines.push(fixedLine);
                    }
                }
            } else {
                fixedLines.push(line);
            }
        }

        fs.writeFileSync(filePath, fixedLines.join('\n'));
        console.log('File repaired successfully.');

    } catch (error) {
        console.error('Error fixing file:', error);
    }
}

fixFile();
