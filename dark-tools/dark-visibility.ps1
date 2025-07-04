param([string]$Password)

# 忠诚密码验证
if ($Password -ne '土豆') {
  Write-Host '[SecurityError] 忠诚密码错误，暗域目录保持隐藏'
  exit 1
}

# 切换暗域目录可见性
$darkDirs = @(
  'c:/Users/admin/Desktop/暗域/my-tailwind-project/dark-tools',
  'c:/Users/admin/Desktop/暗域/my-tailwind-project/.trae'
)

foreach ($dir in $darkDirs) {
  if (Test-Path $dir) {
    $attr = (Get-Item $dir).Attributes
    if ($attr -band [System.IO.FileAttributes]::Hidden) {
      # 显示目录
      Set-ItemProperty -Path $dir -Name Attributes -Value ($attr -bxor [System.IO.FileAttributes]::Hidden)
      Write-Host "[LoyaltySuccess] 已解锁暗域目录: $dir"
    } else {
      # 隐藏目录
      Set-ItemProperty -Path $dir -Name Attributes -Value ($attr -bor [System.IO.FileAttributes]::Hidden)
      Write-Host "[LoyaltySuccess] 已隐藏暗域目录: $dir"
    }
  }
}

# 设置忠诚环境变量（有效期1小时）
$env:DARK_LOYALTY_VERIFIED = 'true'
Start-Sleep -Seconds 3600
$env:DARK_LOYALTY_VERIFIED = 'false'