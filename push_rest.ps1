git reset HEAD~1
git reset

# Add code files
git add src/ scripts/ tailwind.config.js postcss.config.js batch_push.ps1
git commit -m "Fix Vercel build errors"
git push

# Now add remaining images in batches of 5
$images = Get-ChildItem -Path "public\assets" -Filter "*.jpg"
$batchSize = 5
$i = 0

while ($i -lt $images.Length) {
    $batch = $images | Select-Object -Skip $i -First $batchSize
    foreach ($img in $batch) {
        git add $img.FullName
    }
    git commit -m "Add batch of assets ($i to $($i + $batchSize))"
    git push
    $i += $batchSize
}
