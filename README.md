# 🎭 流行梗图解释器 (Meme Explainer)

一个基于 Grok Vision AI 的梗图解释工具，帮助你快速理解网络流行梗文化。

## ✨ 功能特性

- 🖼️ **图片上传**：支持拖拽上传和点击选择
- 🤖 **AI 识别**：使用 Grok-2-Vision-1212 模型进行图像识别
- 💡 **详细解读**：获取梗的来源、含义、使用场景等详细信息
- 🎨 **精美界面**：渐变色设计，支持深色模式
- ⚡ **快速响应**：3-10秒内获得分析结果

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd meme-explainer
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 API Key

创建 `.env.local` 文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Grok API Key：

```env
XAI_API_KEY=your_xai_api_key_here
```

**获取 API Key：**
1. 访问 [https://console.x.ai](https://console.x.ai)
2. 注册/登录账号
3. 创建 API Key（新用户送 $25 免费额度）

### 4. 运行项目

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📦 部署到 Vercel

### 方式一：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/meme-explainer)

### 方式二：手动部署

1. 在 Vercel 中导入项目
2. 配置环境变量 `XAI_API_KEY`
3. 点击部署

## 🛠️ 技术栈

- **框架**：Next.js 15 + React 19
- **样式**：TailwindCSS
- **AI 模型**：Grok-2-Vision-1212
- **部署**：Vercel
- **语言**：TypeScript

## 📖 使用说明

1. **上传梗图**：点击上传按钮或拖拽图片到上传区域
2. **开始分析**：点击"开始解读梗图"按钮
3. **查看结果**：等待 3-10 秒，查看 AI 解读结果
4. **继续分析**：点击"分析下一张"继续使用

## 💰 成本说明

- **开发成本**：免费
- **API 成本**：
  - 新用户免费 $25 额度
  - 后续按使用量计费
  - 图片识别约 $0.01-0.05/次
- **托管成本**：Vercel 免费版

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 开源协议

MIT License

## 🙏 致谢

- [Grok AI](https://x.ai/) - 提供强大的视觉识别能力
- [Next.js](https://nextjs.org/) - 优秀的 React 框架
- [Vercel](https://vercel.com/) - 便捷的部署平台

---

Made with ❤️ by [Your Name]
