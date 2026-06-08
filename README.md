# 小学生英语语法测试

一个面向本地单用户场景的英语语法练习项目，既可以作为网页应用运行，也可以封装成 Windows 桌面应用。它把整理后的中考真题选择题和填空题转成适合小学生使用的练习题库，并在每次作答后立即返回正确答案、对应考点和简短讲解。

## 项目目标

- 支持英语语法单题练习，而不是整张试卷模式
- 每道题提交后立即给出反馈
- 题库和知识库分离，便于后续持续扩展
- 支持从整理后的真题资料继续导入题目
- 本地保存练习记录，方便后续做错题分析或学习报告
- 支持封装成可双击打开的桌面应用

## 当前功能

- 随机练习
- 按考点练习
- 选择题作答
- 填空题作答
- 即时判题
- 每题返回：
  - 正确答案
  - 所属考点
  - 1 到 3 句简短讲解
- 练习结束后生成结果汇总：
  - 总题数
  - 答对题数
  - 正确率
  - 错题列表
  - 每道错题对应考点和讲解
- 本地 JSON 持久化练习记录
- Electron 桌面封装

## 技术栈

- 前端：React 18 + TypeScript + Vite
- 后端：Express + TypeScript
- 桌面封装：Electron
- 校验：Zod
- 测试：Vitest
- 存储：本地 JSON 文件

## 运行方式

### 1. 安装依赖

```bash
npm install
```

### 2. 启动网页开发环境

```bash
npm run dev
```

启动后：

- 前端地址：[http://localhost:4175](http://localhost:4175)
- 后端地址：[http://localhost:4310](http://localhost:4310)

### 3. 启动桌面开发环境

```bash
npm run dev:desktop
```

这个命令会同时启动：

- Express 后端
- Vite 前端
- Electron 桌面窗口

### 4. 构建网页生产版本

```bash
npm run build
```

### 5. 启动网页生产服务

```bash
npm run start
```

### 6. 本地启动桌面应用

```bash
npm run start:desktop
```

适合在本机直接测试 Electron 壳子。

### 7. 打包 Windows 安装程序

```bash
npm run build:desktop
```

打包完成后，安装包会输出到 `release/` 目录。

### 8. 运行测试

```bash
npm test
```

## 项目结构

```text
primary-english-grammar-quiz/
├─ data/
│  ├─ attempts.json
│  ├─ import-template.json
│  ├─ knowledge-points.json
│  └─ questions.json
├─ src/
│  ├─ client/
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  └─ styles.css
│  ├─ electron/
│  │  ├─ main.ts
│  │  └─ preload.ts
│  └─ server/
│     ├─ attemptStore.ts
│     ├─ config.ts
│     ├─ contentStore.ts
│     ├─ fsUtils.ts
│     ├─ index.ts
│     ├─ quizService.ts
│     ├─ quizService.test.ts
│     ├─ types.ts
│     └─ validation.ts
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.server.json
├─ tsconfig.electron.json
└─ vite.config.ts
```

## 数据文件说明

### `data/questions.json`

题库文件，保存实际用于练习的题目。

字段说明：

- `id`：题目唯一标识
- `sourceType`：题型，`choice` 或 `cloze`
- `stem`：题干
- `options`：选择题选项，填空题可省略
- `answer`：正确答案
- `gradeBand`：年级段预留字段
- `examSource`：真题来源
- `knowledgePointId`：关联考点 ID
- `explanation`：简短讲解
- `difficulty`：难度预留字段

### `data/knowledge-points.json`

知识库文件，保存考点定义。

字段说明：

- `id`：考点唯一标识
- `name`：考点名称
- `category`：考点分类
- `description`：考点说明
- `keywords`：关键词列表
- `relatedPoints`：相关考点列表

### `data/attempts.json`

本地练习记录文件，每次提交答案后都会追加一条记录。

### `data/import-template.json`

后续从 Word/PDF 整理题目时使用的中间模板。首版不直接解析 Word/PDF，建议先人工整理成这个结构，再导入题库。

## 导题约定

当前版本不做 Word/PDF 自动解析。推荐流程如下：

1. 从原始 Word 或 PDF 中整理出题目内容
2. 按 `data/import-template.json` 的字段结构填充
3. 补齐考点名称、考点 ID、正确答案和简短讲解
4. 将整理后的内容转换到 `data/questions.json`
5. 如果遇到新考点，同时补充 `data/knowledge-points.json`

这样做的好处是：

- 可控，避免自动解析错误
- 便于人工校对答案和讲解
- 方便后续扩展批量导题脚本或后台管理页

## API 接口

### `GET /api/knowledge-points`

返回全部考点数据。

### `GET /api/questions`

返回题库题目。

支持查询参数：

- `knowledgePointId`：按考点筛题

### `POST /api/quiz/start`

开始一轮练习。

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
  "knowledgePointId": "kp-be-verb",
  "questionCount": 5
}
```

### `POST /api/quiz/submit`

提交当前题目的答案。

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
- 所属考点
- 简短讲解
- 当前进度
- 下一题
- 若练习完成，则返回结果汇总

### `GET /api/attempts/:id`

按记录 ID 获取某次作答记录。

## 判题规则

### 选择题

- 直接按答案文本匹配

### 填空题

- 忽略首尾空格
- 忽略大小写
- 当前版本不支持同义答案、多答案或复杂语法变体判断

## 测试覆盖

当前测试已经覆盖以下场景：

- 按考点筛题
- 随机组卷
- 选择题答对反馈
- 填空题忽略大小写和首尾空格
- 错题汇总生成
- 练习记录写入本地文件
- 题库与考点关联校验

## 桌面版说明

桌面版由 Electron 承载，内部仍然使用现有的 React 前端和 Express 后端逻辑。

打包后：

- 前端页面由本地文件加载
- 后端接口由应用内置服务提供
- 题库和知识库按应用资源目录读取
- 练习记录保存在用户本地目录

这意味着你后续扩题时，不需要重写应用本身，只要维护题库和知识库即可。

## 后续可扩展方向

- 增加题库管理页
- 增加批量导题脚本
- 增加错题本视图
- 增加学习报告
- 增加按年级和难度筛题
- 增加考点统计图表
- 增加账号体系和多用户记录
- 增加桌面端自动更新

## 注意事项

- 当前项目默认是本地单用户使用
- 当前数据存储方式是本地 JSON，不适合高并发场景
- 如果要部署到线上，建议下一步改成数据库存储
- 如果后续题目量增大，建议补一个独立的导入脚本和管理后台
- 打包桌面版前，建议先执行 `npm test` 和 `npm run build`
