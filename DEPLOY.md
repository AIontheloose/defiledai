# DefiledAI Patch — Deploy Instructions

## Step 1 — Create restore point (run this FIRST)

```powershell
cd C:\Users\Trent\defiledai
git tag restore-point-pre-patch
git push origin restore-point-pre-patch
```

## Step 2 — Copy patch files into your project

Copy everything from this zip into your project root at `C:\Users\Trent\defiledai\`, merging with existing files.

**Files included in this patch:**
```
app/
  layout.tsx              ← replaces existing (nav cleanup, OG tags, favicon)
  globals.css             ← replaces existing (scanlines, prose fixes)
  page.tsx                ← replaces existing (hero depth, fixed stats, animated feed)
  articles/
    page.tsx              ← NEW (article listing page)
  benchmarks/
    page.tsx              ← NEW (full benchmark tables)
  models/
    page.tsx              ← NEW (model database)
  quantization/
    page.tsx              ← NEW (quantization guide)
  hardware/
    page.tsx              ← NEW (build configs + GPU matrix)
  forum/
    page.tsx              ← NEW (forum with categories + recent posts)
  resources/
    page.tsx              ← NEW (guides + external tools)
  login/
    page.tsx              ← replaces existing (styled login form)
  signup/
    page.tsx              ← replaces existing (styled signup form)
public/
  favicon.svg             ← NEW (DefiledAI favicon)
RESTORE_POINT.md          ← keep this for reference
```

## Step 3 — Push to Cloudflare

```powershell
cd C:\Users\Trent\defiledai
git add -A
git commit -m "feat: full site redesign — pages, hero depth, nav cleanup, favicon, OG tags"
git push
```

Cloudflare Pages will build automatically. Build takes ~30-60 seconds.

## If anything breaks — restore

```powershell
# Option A: revert last commit
git revert HEAD
git push

# Option B: hard reset to restore point tag
git reset --hard restore-point-pre-patch
git push --force
```
