# 小学生英语语法测试

一个独立的英语语法练习项目，面向本地单用户使用场景。

项目支持：
- Web 练习
- Windows 桌面应用封装
- 按题型和考点练习
- 即时判题反馈
- 错题再练
- 题库、答案、考点分离维护

## 开源说明

本项目以 `MIT License` 开源。

你可以：
- 使用
- 修改
- 分发
- 二次开发

但需要保留原始版权和许可证声明。详细条款见 [LICENSE](./LICENSE)。

## 当前功能

- 随机练习
- 按考点练习
- 选择题练习
- 填空题练习
- 自定义练习题数
- 每题即时反馈
- 结果汇总
- 错题再练
- 本地作答记录保存
- 本地 JSON 题库和知识库读取
- Electron 桌面壳

## 技术栈

- 前端：React 18 + TypeScript + Vite
- 后端：Express + TypeScript
- 桌面封装：Electron
- 数据校验：Zod
- 测试：Vitest
- 存储：本地 JSON 文件

## 本地运行

### 环境要求

- Windows
- Node.js 18 或更高
- npm 9 或更高

检查版本：

```bash
node -v
npm -v
```

### 安装依赖

```bash
npm install
```

### 启动 Web 开发模式

```bash
npm run dev
```

默认地址：
- 前端：`http://localhost:4175`
- 后端：`http://localhost:4310`

### 启动桌面开发模式

```bash
npm run dev:desktop
```

这个命令会同时启动：
- Express 后端
- Vite 前端
- Electron 桌面窗口

### 构建 Web 版本

```bash
npm run build
```

输出目录：
- 前端静态文件：`dist/`
- 后端构建文件：`dist/server/`

### 启动生产服务

```bash
npm run start
```

### 构建 Windows 安装包

```bash
npm run build:desktop
```

默认输出目录：
- `release/`

### 运行测试

```bash
npm test
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Web 开发模式 |
| `npm run dev:server` | 单独启动后端 |
| `npm run dev:client` | 单独启动前端 |
| `npm run dev:desktop` | 启动桌面开发模式 |
| `npm run build` | 构建 Web 版本 |
| `npm run build:electron` | 构建 Electron 代码 |
| `npm run build:desktop` | 构建桌面安装包 |
| `npm run start` | 启动生产后端 |
| `npm run start:desktop` | 启动本地桌面应用 |
| `npm test` | 运行测试 |

## 项目结构

```text
primary-english-grammar-quiz/
|-- data/
|   |-- attempts.json
|   |-- import-template.json
|   |-- knowledge-points.json
|   `-- questions.json
|-- question-bank/
|   |-- answers-text/
|   |-- images/
|   |-- json/
|   |-- manual/
|   |-- parsed/
|   |-- questions-text/
|   `-- raw-exams/
|-- scripts/
|-- src/
|   |-- client/
|   |-- electron/
|   `-- server/
|-- package.json
|-- tsconfig.server.json
|-- tsconfig.electron.json
`-- vite.config.ts
```

## 数据说明

### `data/questions.json`

运行时题库文件，前后端练习流程直接读取这里的数据。

主要字段：
- `id`
- `sourceType`
- `stem`
- `options`
- `answer`
- `gradeBand`
- `examSource`
- `knowledgePointId`
- `explanation`
- `difficulty`

### `data/knowledge-points.json`

运行时知识库文件。

主要字段：
- `id`
- `name`
- `category`
- `description`
- `keywords`
- `relatedPoints`

### `data/attempts.json`

本地作答记录文件。每次提交答案后会追加记录。

### `data/import-template.json`

后续人工整理 Word/PDF 题目时使用的导入模板。

## 题库工作区

`question-bank/` 是题库整理工作区，不是前端运行时直接读取的目录。

主要用途：
- `raw-exams/`：原始试卷文件
- `parsed/`：原始文件转出的中间文本
- `questions-text/`：拆分后的题目文本
- `answers-text/`：拆分后的答案文本
- `manual/`：人工补录和纠偏数据
- `json/`：可导入系统的结构化产物
- `images/`：无法直接抽文本时的辅助图片

## 导题与扩库流程

推荐流程：

1. 把新的 Word/PDF 原始题放进 `question-bank/raw-exams/`
2. 先整理出题目文本和答案文本
3. 如果自动抽取不稳定，在 `question-bank/manual/` 里补录
4. 运行题库处理脚本
5. 生成新的结构化 JSON
6. 校验后同步到 `data/questions.json` 和 `data/knowledge-points.json`

相关脚本：
- `node scripts/process-question-bank.mjs`
- `node scripts/generate-manual-overrides.mjs`
- `node scripts/generate-legacy-overrides.mjs`
- `node scripts/enrich-knowledge-points.mjs`

## 练习规则

### 选择题

- 按正确选项文本判定
- 兼容题库里使用 `A/B/C/D` 存储答案的情况

### 填空题

- 忽略首尾空格
- 忽略大小写

## 仓库地址

- GitHub: `https://github.com/jjy1213/primary-english-grammar-quiz`
