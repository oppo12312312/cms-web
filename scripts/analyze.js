const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const fs = require('fs')
const path = require('path')

// 分析bundle大小
function analyzeBundleSize() {
  console.log('📊 分析bundle大小...')

  const distPath = path.resolve(__dirname, '../dist')
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist目录不存在，请先运行 npm run build')
    return
  }

  // 递归获取文件大小
  function getFileSize(filePath) {
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      const files = fs.readdirSync(filePath)
      return files.reduce((total, file) => {
        return total + getFileSize(path.join(filePath, file))
      }, 0)
    }
    return stats.size
  }

  const totalSize = getFileSize(distPath)
  console.log(`📦 总bundle大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)

  // 分析各文件类型大小
  const fileTypes = {}
  function analyzeFileTypes(dir) {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stats = fs.statSync(filePath)

      if (stats.isDirectory()) {
        analyzeFileTypes(filePath)
      } else {
        const ext = path.extname(file)
        if (!fileTypes[ext]) fileTypes[ext] = 0
        fileTypes[ext] += stats.size
      }
    })
  }

  analyzeFileTypes(distPath)

  console.log('\n📋 文件类型分析:')
  Object.entries(fileTypes)
    .sort(([, a], [, b]) => b - a)
    .forEach(([ext, size]) => {
      console.log(`  ${ext || '无扩展名'}: ${(size / 1024 / 1024).toFixed(2)} MB`)
    })
}

// 检查依赖大小
function checkDependencySize() {
  console.log('\n📦 检查依赖大小...')

  const packageJson = require('../package.json')
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

  const largeDeps = []

  Object.keys(dependencies).forEach(dep => {
    try {
      const depPath = path.resolve(__dirname, '../node_modules', dep)
      if (fs.existsSync(depPath)) {
        const size = getDirSize(depPath)
        if (size > 1024 * 1024) {
          // > 1MB
          largeDeps.push({ name: dep, size })
        }
      }
    } catch (e) {
      // 忽略错误
    }
  })

  largeDeps.sort((a, b) => b.size - a.size)

  console.log('\n🔍 大型依赖 (> 1MB):')
  largeDeps.slice(0, 10).forEach(({ name, size }) => {
    console.log(`  ${name}: ${(size / 1024 / 1024).toFixed(2)} MB`)
  })
}

function getDirSize(dirPath) {
  let size = 0
  try {
    const files = fs.readdirSync(dirPath)
    files.forEach(file => {
      const filePath = path.join(dirPath, file)
      const stats = fs.statSync(filePath)
      if (stats.isDirectory()) {
        size += getDirSize(filePath)
      } else {
        size += stats.size
      }
    })
  } catch (e) {
    // 忽略错误
  }
  return size
}

// 主函数
function main() {
  console.log('🚀 开始性能分析...\n')

  analyzeBundleSize()
  checkDependencySize()

  console.log('\n✅ 分析完成!')
  console.log('\n💡 优化建议:')
  console.log('  1. 考虑使用动态导入进行代码分割')
  console.log('  2. 移除未使用的依赖')
  console.log('  3. 使用 webpack-bundle-analyzer 进行详细分析')
  console.log('  4. 启用gzip压缩')
}

if (require.main === module) {
  main()
}

module.exports = { analyzeBundleSize, checkDependencySize }
