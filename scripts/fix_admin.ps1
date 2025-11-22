
$lines = Get-Content "server/routes/admin.ts"
$newLines = @()
$corrupted = $false
$garbageSkipped = $false

foreach ($line in $lines) {
    if ($line -match "await storage.updateMenuItemOrder") {
        $newLines += $line
        $corrupted = $true
        
        # Insert User Management
        $newLines += '// User Management'
        $newLines += 'router.get("/users", requireAdminAuth, async (req, res) => {'
        $newLines += '    try {'
        $newLines += '        const users = await storage.getAdminUsers();'
        $newLines += '        const safeUsers = users.map(({ passwordHash, ...user }) => user);'
        $newLines += '        res.json(safeUsers);'
        $newLines += '    } catch (error) {'
        $newLines += '        console.error("Failed to fetch users:", error);'
        $newLines += '        res.status(500).json({ message: "Failed to fetch users" });'
        $newLines += '    }'
        $newLines += '});'
        
        $newLines += 'router.post("/users", requireAdminAuth, async (req, res) => {'
        $newLines += '    try {'
        $newLines += '        const { username, email, password, role, isActive } = req.body;'
        $newLines += '        if (!username || !email || !password) {'
        $newLines += '            return res.status(400).json({ message: "Username, email, and password are required" });'
        $newLines += '        }'
        $newLines += '        const passwordHash = await bcrypt.hash(password, 10);'
        $newLines += '        const newUser = await storage.createAdminUser({'
        $newLines += '            username, email, passwordHash, role: role || "admin", isActive: isActive !== undefined ? isActive : true'
        $newLines += '        });'
        $newLines += '        const { passwordHash: _, ...safeUser } = newUser;'
        $newLines += '        res.status(201).json(safeUser);'
        $newLines += '    } catch (error) {'
        $newLines += '        console.error("Failed to create user:", error);'
        $newLines += '        res.status(500).json({ message: error.message || "Failed to create user" });'
        $newLines += '    }'
        $newLines += '});'

        $newLines += 'router.put("/users/:id", requireAdminAuth, async (req, res) => {'
        $newLines += '    try {'
        $newLines += '        const userId = parseInt(req.params.id);'
        $newLines += '        const { username, email, password, role, isActive } = req.body;'
        $newLines += '        const updates = {};'
        $newLines += '        if (username) updates.username = username;'
        $newLines += '        if (email) updates.email = email;'
        $newLines += '        if (role) updates.role = role;'
        $newLines += '        if (isActive !== undefined) updates.isActive = isActive;'
        $newLines += '        if (password) updates.passwordHash = await bcrypt.hash(password, 10);'
        $newLines += '        const updatedUser = await storage.updateAdminUser(userId, updates);'
        $newLines += '        const { passwordHash: _, ...safeUser } = updatedUser;'
        $newLines += '        res.json(safeUser);'
        $newLines += '    } catch (error) {'
        $newLines += '        console.error("Failed to update user:", error);'
        $newLines += '        res.status(500).json({ message: error.message || "Failed to update user" });'
        $newLines += '    }'
        $newLines += '});'

        $newLines += 'router.delete("/users/:id", requireAdminAuth, async (req, res) => {'
        $newLines += '    try {'
        $newLines += '        const userId = parseInt(req.params.id);'
        $newLines += '        await storage.deleteAdminUser(userId);'
        $newLines += '        res.status(204).send();'
        $newLines += '    } catch (error) {'
        $newLines += '        console.error("Failed to delete user:", error);'
        $newLines += '        res.status(500).json({ message: error.message || "Failed to delete user" });'
        $newLines += '    }'
        $newLines += '});'
        
        $newLines += '// Webhook Management'
        $newLines += 'router.get("/webhooks", requireAdminAuth, async (req, res) => {'
        $newLines += '    try {'
        $newLines += '        const webhooks = await storage.getWebhooks();'
        $newLines += '        res.json(webhooks);'
        $newLines += '    } catch (error) {'
        $newLines += '        res.status(500).json({ message: "Failed to fetch webhooks" });'
        $newLines += '    }'
        $newLines += '});'

        continue
    }
    
    if ($corrupted) {
        # Skip the garbage lines until we see router.post("/webhooks"
        if (-not $garbageSkipped) {
            if ($line -match "r o u t e r . p o s t") {
                $garbageSkipped = $true
                # Process this line
                $chars = $line.ToCharArray()
                $newLine = ""
                for ($i = 1; $i -lt $chars.Length; $i += 2) {
                    $newLine += $chars[$i]
                }
                $newLines += $newLine
            }
            continue
        }

        # Process corrupted lines
        if ($line.Trim().Length -eq 0) {
            $newLines += ""
        } else {
            $chars = $line.ToCharArray()
            $newLine = ""
            for ($i = 1; $i -lt $chars.Length; $i += 2) {
                $newLine += $chars[$i]
            }
            $newLines += $newLine
        }
    } else {
        $newLines += $line
    }
}

$newLines | Set-Content "server/routes/admin.ts"
Write-Host "File repaired successfully."
