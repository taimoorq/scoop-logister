# Scoop Bucket For Logister

This bucket distributes the Logister CLI for Windows users.

## Install

```powershell
scoop bucket add logister https://github.com/taimoorq/scoop-logister
scoop install logister
```

The installed executable is:

```powershell
logister version
```

## Update

```powershell
scoop update
scoop update logister
```

## Maintainer Notes

Release updates are generated from the published `logister-cli` npm tarball:

```bash
node scripts/update-manifest.mjs \
  --version 0.1.0 \
  --sha256 <release-tarball-sha256>
```

The manifest must use the same version and checksum as the npm registry tarball
`https://registry.npmjs.org/logister-cli/-/logister-cli-X.Y.Z.tgz`.
