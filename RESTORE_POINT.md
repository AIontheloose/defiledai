# Restore Point — Pre-Patch

If anything breaks, run:

```powershell
git log --oneline -5
git revert HEAD
git push
```

Or to hard reset to before this patch:

```powershell
git log --oneline   # find the commit hash before this patch
git reset --hard <that-commit-hash>
git push --force
```

## What this patch changes:
- app/page.tsx — hero depth, real stats removed, fixed live indicator
- app/globals.css — adds grid bg, scanlines, animations
- components/Nav.tsx — removes dead Light toggle, cleans nav
- app/benchmarks/page.tsx — NEW full benchmarks page
- app/models/page.tsx — NEW models database page
- app/quantization/page.tsx — NEW quantization guide page
- app/hardware/page.tsx — NEW hardware configs page
- app/forum/page.tsx — NEW forum page
- app/resources/page.tsx — NEW resources page
- public/favicon.svg — NEW favicon
- app/layout.tsx — adds OG meta tags, favicon
