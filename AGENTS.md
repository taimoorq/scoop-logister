# Logister Scoop Bucket Agent Notes

This public bucket wraps the canonical `logister-cli` npm artifact. It is not
an independent source release. Never commit registry credentials or local
package manager state.

## Update contract

- Do not update `bucket/logister.json` until the exact CLI version is publicly
  visible on npm.
- `version`, the versioned npm tarball URL, and the lowercase SHA256 `hash` must
  describe the same downloaded artifact.
- Prefer running `npm run update:package-managers` from the sibling
  `logister-cli` repository; it updates Homebrew and Scoop from one npm tarball.
- Preserve `LOGISTER_INSTALL_SOURCE=scoop`, `extract_dir`, command-wrapper
  quoting, `checkver`, and `autoupdate` behavior.
- Keep GitHub Actions Dependabot enabled and pin Actions to full commit SHAs.

## Verification

Run before merge in PowerShell or rely on the Windows CI equivalent:

```powershell
$manifest = Get-Content bucket/logister.json -Raw | ConvertFrom-Json
$archive = Join-Path $env:TEMP "logister-cli-$($manifest.version).tgz"
Invoke-WebRequest -Uri $manifest.url -OutFile $archive
$actual = (Get-FileHash $archive -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $manifest.hash) { throw "Package hash mismatch" }
```

Merge the bucket PR only after the matching npm and GitHub CLI releases exist.
