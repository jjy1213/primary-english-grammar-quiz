# 小学生英语语法测试

一个独立的英语语法练习项目，面向本地单用户使用场景。项目支持 Web 运行，也支持封装成 Windows 桌面应用。

首版核心目标：

- 让学生按题库做英语语法练习
- 每题提交后立即返回对错、正确答案、考点和简短讲解
- 支持按考点筛题和随机练习
- 把题库、答案、考点、导题中间产物分开管理，方便后续继续扩库

## 当前已完成

- Web 版前后端一体项目
- Electron 桌面版壳子
- 本地 JSON 题库与知识库读取
- 随机练习
- 按考点练习
- 选择题作答
- 填空题作答
- 即时判题反馈
- 结果汇总页
- 本地作答记录保存
- 上海中考英语题库整理链路
- 2008-2021 年题库素材归档
- 可导入系统的结构化题库 JSON

## 技术栈

- 前端：React 18 + TypeScript + Vite
- 后端：Express + TypeScript
- 桌面封装：Electron
- 数据校验：Zod
- 测试：Vitest
- 数据存储：本地 JSON 文件

## 本地运行

### 1. 环境要求

- Windows
- Node.js 18 或更高版本
- npm 9 或更高版本

先确认版本：

```bash
node -v
npm -v
```

### 2. 安装依赖

在项目根目录执行：

```bash
npm install
```

### 3. 启动 Web 开发模式

```bash
npm run dev
```

启动后默认地址：

- 前端：`http://localhost:4175`
- 后端：`http://localhost:4310`

适合日常开发、改界面、改接口、调题库。

### 4. 启动桌面开发模式

```bash
npm run dev:desktop
```

这个命令会同时启动：

- Express 后端
- Vite 前端
- Electron 桌面窗口

适合联调桌面壳、窗口行为和本地打包前验证。

### 5. 构建 Web 生产版本

```bash
npm run build
```

构建输出：

- 前端静态文件到 `dist/`
- 后端编译结果到 `dist/server/`

### 6. 启动 Web 生产服务

```bash
npm run start
```

默认监听：

- `http://localhost:4310`

### 7. 本地启动桌面应用

先构建：

```bash
npm run build
npm run build:electron
```

然后启动：

```bash
npm run start:desktop
```

### 8. 打包 Windows 安装包

```bash
npm run build:desktop
```

默认打包输出目录：

- `release/`

### 9. 运行测试

```bash
npm test
```

当前已验证通过：

- `7` 个 Vitest 测试全部通过

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Web 开发模式 |
| `npm run dev:server` | 单独启动后端监听 |
| `npm run dev:client` | 单独启动前端 |
| `npm run dev:desktop` | 启动桌面开发模式 |
| `npm run build` | 构建 Web 生产版本 |
| `npm run build:electron` | 编译 Electron 代码 |
| `npm run build:desktop` | 构建并打包桌面安装包 |
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
|   |-- enrich-knowledge-points.mjs
|   |-- generate-legacy-overrides.mjs
|   |-- generate-manual-overrides.mjs
|   `-- process-question-bank.mjs
|-- src/
|   |-- client/
|   |-- electron/
|   `-- server/
|-- package.json
|-- tsconfig.server.json
|-- tsconfig.electron.json
`-- vite.config.ts
```

## 数据文件说明

### `data/questions.json`

运行时题库文件，前后端练习流程实际读取这里的数据。

当前状态：

- 总题数：`584`
- 其中真实整理题：`578`
- 兼容保留示例题：`6`

主要字段：

- `id`
- `sourceType`：`choice` / `cloze`
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

当前状态：

- 总考点数：`22`

主要字段：

- `id`
- `name`
- `category`
- `description`
- `keywords`
- `relatedPoints`

### `data/attempts.json`

本地作答记录文件。每次提交答案后会追加记录。

主要字段：

- `id`
- `submittedAt`
- `questionId`
- `userAnswer`
- `isCorrect`
- `correctAnswer`
- `knowledgePointId`

### `data/import-template.json`

后续人工整理 Word/PDF 题目时的导入模板。

## 题库目录说明

`question-bank/` 是题库整理工作区，不是前端运行时直接读取目录。

### 目录用途

- `raw-exams/`
  - 原始试卷文件
- `parsed/`
  - 原始文件转出的文本中间结果
- `questions-text/`
  - 拆分后的题目文本
- `answers-text/`
  - 拆分后的答案文本
- `manual/`
  - 人工补录和纠偏数据
- `json/`
  - 可导入系统的结构化产物
- `images/`
  - 无法直接抽文本时的图片辅助材料

### 当前结构化产物

- `question-bank/json/import-ready-questions.json`
  - `578` 题
- `question-bank/json/answer-map.json`
  - `578` 条题答对应关系
- `question-bank/json/import-ready-knowledge-points.json`
  - 导入用知识点结构
- `question-bank/json/extraction-report.json`
  - 抽取报告

## 导题与扩库流程

推荐后续继续按这条链路扩展：

1. 把新的 Word/PDF 原始题放入 `question-bank/raw-exams/`
2. 先整理出题目文本和答案文本
3. 如自动抽取不稳定，在 `question-bank/manual/` 中补录
4. 运行题库处理脚本
5. 生成新的结构化 JSON
6. 校验后同步到 `data/questions.json` 和 `data/knowledge-points.json`

当前相关脚本：

- `node scripts/process-question-bank.mjs`
- `node scripts/generate-manual-overrides.mjs`
- `node scripts/generate-legacy-overrides.mjs`
- `node scripts/enrich-knowledge-points.mjs`

## 练习规则

### 选择题

- 直接按答案文本匹配

### 填空题

- 忽略首尾空格
- 忽略大小写

当前首版暂不支持：

- 同义答案
- 多答案并列
- 更复杂的语法变体判定

## API 接口

### `GET /api/status`

健康检查。

### `GET /api/knowledge-points`

返回全部考点。

### `GET /api/questions`

返回题目列表。

可选查询参数：

- `knowledgePointId`

### `POST /api/quiz/start`

开始练习。

请求示例：

```json
{
  "mode": "random",
  "questionCount": 5
}
```

或：

```json
{
  "mode": "knowledgePoint",
  "knowledgePointId": "kp-tense",
  "questionCount": 5
}
```

### `POST /api/quiz/submit`

提交单题答案。

请求示例：

```json
{
  "sessionId": "quiz-session-id",
  "questionId": "q-001",
  "userAnswer": "is"
}
```

返回内容包括：

- 是否答对
- 正确答案
- 对应考点
- 简短讲解
- 当前进度
- 下一题
- 完成时的结果汇总

### `GET /api/attempts/:id`

按作答记录 ID 查询单条记录。

## 交付说明

当前仓库已经包含以下可交付内容：

### 1. 可运行项目源码

- Web 前端
- Express 后端
- Electron 桌面壳

### 2. 运行时数据

- `data/questions.json`
- `data/knowledge-points.json`
- `data/attempts.json`

### 3. 题库整理工作区

- 原始试卷
- 题目文本
- 答案文本
- 人工补录
- 结构化 JSON
- 抽取报告

### 4. 题库处理脚本

- 自动整合中间产物
- 生成导入格式
- 扩充知识点

### 5. 桌面打包能力

- 支持本地编译 Electron
- 支持打包 Windows 安装程序

## 适合怎么交付给别人

### 方式一：交源码

适合继续开发的人。

需要提供：

- 整个仓库
- Node.js 环境
- README 运行说明

### 方式二：交桌面安装包

适合只使用、不开发的人。

需要先在本机执行：

```bash
npm run build:desktop
```

然后把 `release/` 里的安装包交给对方。

### 方式三：交题库数据

适合后续继续维护题库的人。

建议至少交这几部分：

- `question-bank/raw-exams/`
- `question-bank/questions-text/`
- `question-bank/answers-text/`
- `question-bank/manual/`
- `question-bank/json/`

## 故障排查

### 1. `npm install` 失败

先确认 Node.js 版本是否过低。

```bash
node -v
```

### 2. 前端页面打不开

确认 `npm run dev` 是否已经成功启动，并检查：

- `http://localhost:4175`
- `http://localhost:4310/api/status`

### 3. 桌面模式打不开

先确认下面两个构建是否正常：

```bash
npm run build
npm run build:electron
```

### 4. 题库新增后页面没变化

这个项目运行时读取的是：

- `data/questions.json`
- `data/knowledge-points.json`

如果你只改了 `question-bank/json/`，但没有同步到 `data/`，前端不会更新。

## 后续建议

- 增加题库管理页面
- 增加错题本
- 增加按年级筛题
- 增加按难度筛题
- 增加学习报告
- 增加批量导题界面
- 增加多用户与账号体系
- 增加数据库存储

## 当前默认端口

- 前端开发端口：`4175`
- 后端服务端口：`4310`

如需修改，可调整环境变量：

- `SERVER_PORT`
- `CLIENT_ORIGIN`
- `APP_ROOT`
- `APP_DATA_ROOT`
