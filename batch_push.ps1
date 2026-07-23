git reset HEAD~1
git reset

# Add code files first
git add src/ scripts/ tailwind.config.js postcss.config.js download_nasa.py download_stock.py package.json package-lock.json
git commit -m "Fix Species grid size and prepare massive data"
git push

# Now add images in batches
$images = Get-ChildItem -Path "public\assets\stock" -Filter "*.jpg"
$batchSize = 25
$i = 0

while ($i -lt $images.Length) {
    $batch = $images | Select-Object -Skip $i -First $batchSize
    foreach ($img in $batch) {
        git add $img.FullName
    }
    git commit -m "Add batch of NASA stock images ($i to $($i + $batchSize))"
    git push
    $i += $batchSize
}
