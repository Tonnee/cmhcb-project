$ErrorActionPreference = "Stop"
$projectRoot = "f:\cmhcb-project"
$stage = Join-Path $projectRoot ".deploy_stage"
$zipPath = Join-Path $projectRoot "cmhcb-deploy.zip"

Write-Host "Creating clean staging directory..."
if (Test-Path $stage) {
    Remove-Item -Recurse -Force $stage
}
New-Item -ItemType Directory -Path $stage | Out-Null

$itemsToCopy = @(
    "app",
    "components",
    "data",
    "features",
    "lib",
    "prisma",
    "public",
    "types",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    "next-env.d.ts",
    "proxy.ts",
    "server.js",
    ".env.production"
)

Write-Host "Copying production files to stage..."
foreach ($item in $itemsToCopy) {
    $src = Join-Path $projectRoot $item
    if (Test-Path $src) {
        Write-Host "  + Adding $item"
        Copy-Item -Path $src -Destination $stage -Recurse -Force
    } else {
        Write-Warning "  - $item not found, skipping"
    }
}

# Also ensure .env exists with production settings in the staging folder
Copy-Item (Join-Path $projectRoot ".env.production") -Destination (Join-Path $stage ".env") -Force

Write-Host "Compressing to $zipPath using tar..."
if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}
# Use Windows built-in bsdtar to create standard zip
Push-Location $stage
try {
    tar.exe -a -c -f $zipPath *
} finally {
    Pop-Location
}

Write-Host "Cleaning up staging directory..."
Remove-Item -Recurse -Force $stage

$zipItem = Get-Item $zipPath
$sizeMB = [math]::Round($zipItem.Length / 1MB, 2)
Write-Host "SUCCESS: $zipPath created successfully ($sizeMB MB)!"
