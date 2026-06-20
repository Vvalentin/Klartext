Add-Type -AssemblyName System.Drawing

$sizes = @(180, 192, 512)
$outDir = Join-Path $PSScriptRoot "..\public\icons"
$null = New-Item -ItemType Directory -Force -Path $outDir

# Theme color: Klartext brand green
$bgColor = [System.Drawing.Color]::FromArgb(255, 34, 139, 87)
$fgColor = [System.Drawing.Color]::White

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Rounded background (filled rect, iOS masks it anyway)
    $bgBrush = New-Object System.Drawing.SolidBrush($bgColor)
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)

    # "K" letter centered
    $fontSize = [int]($size * 0.55)
    $font = New-Object System.Drawing.Font("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fgBrush = New-Object System.Drawing.SolidBrush($fgColor)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $g.DrawString("K", $font, $fgBrush, $rect, $sf)

    $outFile = Join-Path $outDir "icon-$size.png"
    $bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose(); $bmp.Dispose(); $font.Dispose(); $bgBrush.Dispose(); $fgBrush.Dispose()
    Write-Host "Wrote $outFile"
}
