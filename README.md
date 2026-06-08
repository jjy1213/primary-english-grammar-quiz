# 小学生英语语法测试

一个独立的本地 Web 项目，用于把整理后的中考真题选择题与填空题，转成面向小学生的英语语法练习。

## 功能

- 随机练习
- 按考点练习
- 单题即时判题
- 每题返回考点与简短讲解
- 本地保存练习记录
- 题库与知识库分离，便于后续扩展

## 运行

```bash
npm install
npm run dev
```

- 前端：`http://localhost:4175`
- 后端：`http://localhost:4310`

## 数据结构

- `data/knowledge-points.json`：考点知识库
- `data/questions.json`：题库
- `data/attempts.json`：练习记录
- `data/import-template.json`：后续从 Word/PDF 整理后的中间导入模板

## 首版说明

首版不直接解析 Word/PDF。请先按 `data/import-template.json` 的结构整理题目，再转换入库。
