# 结构化题库说明

这个目录存放从上海中考英语真题中整理出的结构化结果。

## 文件说明

### `import-ready-questions.json`

可直接导入练习系统的题库数据。

当前规则：

- 只保留题目与答案能够稳定对应的记录
- 当前以 `Part 2` 的选择题和填空题为主
- 自动抽取不稳定的年份，可以通过 `question-bank/manual/` 的人工补录数据并入

### `answer-map.json`

题目和答案的一一对应表，用来核对：

- 结构化题目 ID
- 年份
- 原始文件名
- 原题号
- 所属区段
- 对应答案

### `import-ready-knowledge-points.json`

当前预置的知识点文件。

现阶段统一先挂到 `kp-pending-shanghai-auto`，后续可以再细分成：

- 时态
- 代词
- 介词
- 词形变化
- 句型转换

### `extraction-report.json`

每个年份的抽取报告，会记录：

- 是否识别到答案区
- 选择题抽取数量
- 填空题抽取数量
- 实际导入数量
- 当前问题说明

## 当前状态

目前已经完成：

- 14 份原始试卷归档
- 每年拆分出 `questions-text/` 和 `answers-text/`
- 生成第一版总题库 JSON
- 新增 `manual/` 目录，支持图片人工补录结果
- `2020` 年已通过图片补录完成 `Part 2` 结构化整理

## 建议用法

如果某一年自动抽取效果不好，可以：

1. 先把题面和答案整理成文本
2. 在 `question-bank/manual/` 新增该年份的 `.json`
3. 重新运行 `node scripts/process-question-bank.mjs`

脚本会优先采用人工补录版本，并自动刷新总 JSON 与对应文本文件。
