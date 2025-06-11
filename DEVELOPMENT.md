# 开发环境配置指南

## 🚀 项目优化配置

本项目已经进行了全面的开发环境优化，以提升开发体验和构建性能。

### 📁 新增配置文件

1. **`.prettierrc.js`** - Prettier 代码格式化配置
2. **`.eslintrc.js`** - ESLint 代码质量检查配置
3. **`.vscode/settings.json`** - VSCode 工作区配置
4. **`.vscode/extensions.json`** - 推荐的 VSCode 插件
5. **`.eslintignore`** - ESLint 忽略文件配置
6. **`scripts/analyze.js`** - 性能分析脚本

### 🛠 开发工具配置

#### 推荐的 VSCode 插件

- **Prettier - Code formatter** - 代码格式化
- **ESLint** - 代码质量检查
- **Vetur** - Vue 开发支持
- **Auto Rename Tag** - 自动重命名标签
- **Bracket Pair Colorizer** - 括号配对着色

#### 格式化配置

- 行宽限制：120 字符
- 缩进：2 空格
- 使用单引号
- 不使用分号
- 保存时自动格式化

### 📦 性能优化

#### 构建性能优化

1. **Webpack 缓存** - 启用文件系统缓存
2. **代码分割** - 自动分割 vendor 和 element-ui
3. **HardSourceWebpackPlugin** - 模块级别缓存
4. **Sass 优化** - 压缩输出

#### 开发体验优化

1. **Lint 警告模式** - 不阻塞编译，只显示警告
2. **错误覆盖** - 只显示错误，隐藏警告
3. **缓存配置** - ESLint 使用缓存提升性能

### 🎯 可用脚本

```bash
# 开发服务器
npm run serve

# 构建生产版本
npm run build

# 构建并分析bundle大小
npm run build:analyze

# 代码检查和修复
npm run lint

# 仅检查代码质量（不修复）
npm run lint:check

# 性能分析
npm run analyze

# 清理缓存
npm run clean
```

### 📊 性能分析

运行 `npm run analyze` 来分析项目性能：

- Bundle 大小分析
- 大型依赖检查
- 文件类型统计
- 优化建议

### 🔧 VSCode 设置

项目已配置了 VSCode 工作区设置，包括：

- 自动格式化配置
- ESLint 集成
- 文件监听优化
- 搜索排除配置

### 📝 代码规范

#### JavaScript/Vue 规范

- 使用 ES6+语法
- 单引号字符串
- 无分号结尾
- 2 空格缩进
- 120 字符行宽

#### 提交前检查

- 代码自动格式化
- ESLint 检查通过
- 无控制台错误

### 🚫 移除的多余依赖

已从 package.json 中移除以下冗余依赖：

- `element` (与 element-ui 重复)

### 💡 使用建议

1. **首次使用**：

   ```bash
   # 安装依赖
   npm install

   # 安装推荐的VSCode插件
   # VSCode会自动提示安装推荐插件
   ```

2. **开发时**：

   - 保存时会自动格式化代码
   - ESLint 错误会在编辑器中高亮显示
   - 代码质量问题会显示为警告，不阻塞开发

3. **性能监控**：

   - 定期运行 `npm run analyze` 检查 bundle 大小
   - 使用 `npm run build:analyze` 进行详细分析

4. **问题排查**：

   ```bash
   # 清理缓存
   npm run clean

   # 重新安装依赖
   npm install
   ```

### 🔗 相关资源

- [Prettier 配置文档](https://prettier.io/docs/en/configuration.html)
- [ESLint 规则文档](https://eslint.org/docs/rules/)
- [Vue 风格指南](https://cn.vuejs.org/v2/style-guide/)
- [Webpack 性能优化](https://webpack.js.org/guides/build-performance/)
