# 🎯 部署和使用指南

## 📋 项目概览

**流行梗图解释器** 是一个基于 Grok Vision AI 的智能梗图解释工具，帮助用户快速理解网络流行梗文化。

### 核心文件说明

```
meme-explainer/
├── app/
│   ├── page.tsx              # 主页面（图片上传和结果展示）
│   ├── layout.tsx            # 根布局
│   └── api/
│       └── analyze/
│           └── route.ts      # Grok API 调用接口
├── .env.local.example        # 环境变量示例
├── .env.local               # 本地环境变量（需配置）
├── package.json             # 项目依赖
├── vercel.json              # Vercel 部署配置
└── README.md                # 项目文档
```

---

## 🚀 本地开发

### 1. 安装依赖

```bash
cd meme-explainer
npm install
```

### 2. 配置 Grok API Key

**重要：** 项目运行前必须配置 API Key！

#### 获取 API Key：

1. 访问 [https://console.x.ai](https://console.x.ai)
2. 注册/登录账号（建议使用 X/Twitter 账号登录）
3. 点击 "API Keys" 创建新的 API Key
4. 复制生成的 Key（格式类似：`xai-xxxxxxxxxxxxx`）

#### 配置环境变量：

编辑 `.env.local` 文件，替换 API Key：

```env
XAI_API_KEY=xai-your-actual-api-key-here
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 4. 测试功能

1. 上传一张梗图（可以从网上找一张流行梗图测试）
2. 点击"开始解读梗图"
3. 等待 3-10 秒查看结果

---

## 🌐 部署到 Vercel

### 方式一：GitHub + Vercel 自动部署（推荐）

#### Step 1: 推送到 GitHub

```bash
cd meme-explainer

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Meme Explainer with Grok AI"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/yourusername/meme-explainer.git

# 推送
git push -u origin main
```

#### Step 2: 导入到 Vercel

1. 访问 [https://vercel.com](https://vercel.com)
2. 登录并点击 "Add New..." → "Project"
3. 选择你的 GitHub 仓库 `meme-explainer`
4. 配置环境变量：
   - 点击 "Environment Variables"
   - 添加：`XAI_API_KEY` = `你的 Grok API Key`
5. 点击 "Deploy"

#### Step 3: 等待部署完成

- 部署通常需要 1-3 分钟
- 成功后会生成一个 `.vercel.app` 域名
- 可以绑定自定义域名

### 方式二：Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
cd meme-explainer
vercel

# 按提示操作，配置环境变量
```

---

## ⚙️ 环境变量配置

### 本地开发
文件：`.env.local`

```env
XAI_API_KEY=your_xai_api_key_here
```

### Vercel 生产环境
在 Vercel Dashboard 中配置：

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加变量：
   - **Key**: `XAI_API_KEY`
   - **Value**: 你的 Grok API Key
   - **Environment**: Production, Preview, Development（全选）

---

## 💡 使用建议

### API 用量管理

- **免费额度**：新用户 $25
- **计费标准**：约 $0.01-0.05/次分析
- **监控用量**：在 [console.x.ai](https://console.x.ai) 查看 API 使用情况

### 优化建议

1. **添加速率限制**：防止恶意调用
2. **缓存常见梗**：减少 API 调用次数
3. **图片大小限制**：建议限制在 5MB 以内
4. **错误处理**：当前已包含基本错误处理

---

## 🔧 常见问题

### Q: API 调用失败怎么办？

**可能原因：**
1. API Key 未配置或配置错误
2. API 额度用尽
3. 网络连接问题
4. 图片格式不支持

**解决方案：**
1. 检查 `.env.local` 文件中的 API Key 是否正确
2. 访问 [console.x.ai](https://console.x.ai) 检查额度
3. 查看浏览器控制台的错误信息
4. 尝试使用其他图片

### Q: 本地开发时修改代码不生效？

**解决方案：**
```bash
# 删除缓存
rm -rf .next

# 重新启动
npm run dev
```

### Q: 部署后环境变量不生效？

**解决方案：**
1. 确认在 Vercel Dashboard 中配置了环境变量
2. 重新部署项目
3. 检查变量名拼写是否正确（区分大小写）

### Q: 图片显示失败？

**原因：** Next.js Image 组件需要配置域名白名单

**解决方案：** 编辑 `next.config.ts`，添加图片域名配置

---

## 📊 性能优化

### 当前性能

- 首次加载：< 3s
- API 响应：3-10s
- 构建大小：约 500KB（gzipped）

### 优化方向

1. **添加缓存层**：使用 Redis 缓存热门梗图结果
2. **压缩图片**：上传前压缩图片大小
3. **CDN 加速**：使用 Vercel Edge Network
4. **懒加载**：优化图片加载策略

---

## 🎨 自定义配置

### 修改 AI 提示词

编辑 `app/api/analyze/route.ts` 中的 prompt：

```typescript
text: `请详细分析这张梗图（meme）：

1. **图片内容描述**：这张图片里有什么？
2. **梗的来源**：这个梗来自哪里？
// ... 自定义你的提示词
`,
```

### 修改 UI 样式

编辑 `app/page.tsx`，使用 TailwindCSS 类名自定义样式。

### 修改 AI 模型

编辑 `app/api/analyze/route.ts`：

```typescript
model: 'grok-2-vision-1212',  // 可以换成其他 Grok 模型
```

---

## 📱 移动端适配

项目已经完全响应式设计，支持：
- 手机浏览器
- 平板设备
- 桌面浏览器

---

## 🔐 安全建议

1. **API Key 保护**：
   - 不要将 `.env.local` 提交到 Git
   - 使用环境变量而非硬编码
   - 定期轮换 API Key

2. **速率限制**：
   - 建议添加 IP 访问频率限制
   - 使用 Vercel Edge Config 或 Upstash Rate Limit

3. **输入验证**：
   - 限制文件大小和类型
   - 防止恶意文件上传

---

## 📞 支持

遇到问题？

1. 查看项目 [GitHub Issues](https://github.com/yourusername/meme-explainer/issues)
2. 阅读 [Grok API 文档](https://docs.x.ai)
3. 查看 [Next.js 文档](https://nextjs.org/docs)

---

**祝你使用愉快！** 🎉
