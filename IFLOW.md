# NotionNext 项目上下文文件

## 项目概述

NotionNext 是一个使用 NextJS + Notion API 实现的静态博客系统，部署在 Vercel 上。这是一个为 Notion 和所有创作者设计的开源博客系统，支持多种主题和部署方案。项目基于 Next.js 框架，利用 Notion 作为内容管理系统，实现了高效的内容创作和发布流程。

### 核心技术栈
- **框架**: Next.js 14.x
- **样式**: Tailwind CSS
- **渲染**: React-notion-x
- **语言**: JavaScript/TypeScript
- **部署**: Vercel

### 主要特性
- 支持多语言
- 多种主题可选（超过20种主题）
- 集成多种评论系统（Twikoo, Giscus, Gitalk, Cusdis, Utterances）
- 支持全文搜索（Algolia）
- SEO 优化
- 响应式设计
- PWA 支持
- RSS 订阅

## 项目结构

```
MyBlog/
├── components/          # React 组件
├── conf/               # 配置文件
├── hooks/              # React hooks
├── lib/                # 工具库和辅助函数
├── pages/              # Next.js 页面路由
├── public/             # 静态资源
├── scripts/            # 构建脚本
├── styles/             # CSS 样式文件
├── themes/             # 主题文件
├── types/              # TypeScript 类型定义
├── .env.local          # 环境变量配置
├── blog.config.js      # 博客配置文件
├── next.config.js      # Next.js 配置
├── package.json        # 项目依赖
└── README.md           # 项目说明
```

## 主要配置文件

### blog.config.js
这是项目的主要配置文件，包含：
- Notion 页面 ID
- 主题配置
- 语言设置
- 作者信息
- SEO 相关配置
- 各种功能开关

### next.config.js
Next.js 项目配置，包含：
- 多语言支持
- 图片优化配置
- 安全头部设置
- Webpack 优化配置
- 主题动态加载

## 主题系统

项目采用动态主题系统，支持多种主题：
- hexo, next, medium, fukasawa, gitbook, heo, matery 等
- 主题通过 `@theme-components` 别名动态加载
- 每个主题都有独立的组件和样式

## 开发和构建

### 依赖安装
```bash
npm install
```

### 开发环境
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 静态导出
```bash
npm run export
```

### 其他脚本
- `npm run lint`: 代码检查
- `npm run lint:fix`: 修复代码问题
- `npm run type-check`: TypeScript 类型检查
- `npm run format`: 代码格式化
- `npm run test`: 运行测试

## 环境变量

主要环境变量定义在 `.env.local` 文件中：
- `NOTION_PAGE_ID`: Notion 页面 ID
- `NEXT_PUBLIC_THEME`: 当前主题
- `NEXT_PUBLIC_LANG`: 语言设置
- `NEXT_PUBLIC_AUTHOR`: 作者名称
- 各种服务的 API 密钥和配置

## 数据获取

项目通过 Notion API 获取数据：
- 使用 `getGlobalData` 获取全局数据
- 使用 `getPostBlocks` 获取文章块数据
- 支持缓存和重新验证机制

## 主要功能模块

### 评论系统
支持多种评论插件配置，包括：
- Twikoo
- Giscus
- Gitalk
- Cusdis
- Utterances

### SEO 优化
- 自动生成 sitemap
- RSS 订阅支持
- Meta 标签优化
- 结构化数据

### 性能优化
- 图片优化（支持 WebP, AVIF 格式）
- 代码分割
- 预加载和预获取
- 静态生成和服务器端渲染

## 文件约定

- JavaScript/TypeScript 文件使用驼峰命名
- 样式文件使用模块化 CSS 或 Tailwind
- 配置文件集中管理在 `conf/` 目录
- 主题相关文件在 `themes/` 目录
- 组件按功能分类存放在 `components/` 目录

## 贡献指南

项目遵循标准的开源贡献流程：
- 代码格式化使用 Prettier
- 代码检查使用 ESLint
- 类型检查使用 TypeScript
- 测试使用 Jest
- 提交前运行 `npm run pre-commit` 检查

## 部署

项目专为 Vercel 部署优化，但也支持静态导出和其他部署方式。