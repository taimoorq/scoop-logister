# Scoop Bucket For Logister

This bucket installs the [`logister` CLI](https://github.com/taimoorq/logister-cli) on Windows. The manifest wraps the canonical `logister-cli` npm tarball and declares `nodejs-lts` as a dependency.

## Install

```powershell
scoop bucket add logister https://github.com/taimoorq/scoop-logister
scoop install logister
```

The installed executable is:

```powershell
logister version
logister help
```

Next, connect to your hosted or self-hosted Logister server:

```powershell
logister auth login --host https://logister.example.com
logister doctor
logister projects list
```

`doctor` should show your CLI version, active profile, server version, and supported feature map without printing the token. See the [CLI README](https://github.com/taimoorq/logister-cli#readme) for project, event, log, and issue examples.

## Update

```powershell
scoop update
scoop update logister
```

To remove the CLI and bucket:

```powershell
scoop uninstall logister
scoop bucket rm logister
```

## Maintainer Notes

This bucket is a distribution repository, not an independent source release. Update it only after the matching `logister-cli` version is visible on npm. Prefer the coordinated updater from a workspace containing the CLI, Homebrew, and Scoop repositories:

```bash
cd ../logister-cli
npm run update:package-managers
```

To update only this manifest, calculate the SHA256 from the downloaded npm tarball and run:

```bash
node scripts/update-manifest.mjs \
  --version X.Y.Z \
  --sha256 <release-tarball-sha256>
```

The manifest must use the same version and checksum as the npm registry tarball
`https://registry.npmjs.org/logister-cli/-/logister-cli-X.Y.Z.tgz`.

Validate the manifest in PowerShell before opening or merging a pull request:

```powershell
$manifest = Get-Content bucket/logister.json -Raw | ConvertFrom-Json
$archive = Join-Path $env:TEMP "logister-cli-$($manifest.version).tgz"
Invoke-WebRequest -Uri $manifest.url -OutFile $archive
$actual = (Get-FileHash $archive -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $manifest.hash) { throw "Package hash mismatch" }
```
