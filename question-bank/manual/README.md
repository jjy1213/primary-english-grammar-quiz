# 手工校准题库

这个目录用于存放自动抽取不稳定年份的人工补录结果。

当前约定：

- 一个年份一个 `.json` 文件
- 文件中同时保存：
  - `questionText`
  - `answerText`
  - `questions`
  - `answers`
  - `report`

当前已补录：

- `2020-part2.json`
  - 来源：`question-bank/images/2020/` 中的试卷图片
  - 范围：`Part 2` 的选择题与填空题

脚本 `scripts/process-question-bank.mjs` 会优先读取这里的人工补录内容。
如果某个年份存在手工校准文件，就会：

- 覆盖生成对应的 `questions-text/<year>-questions.txt`
- 覆盖生成对应的 `answers-text/<year>-answers.txt`
- 将结构化题目并入总题库 JSON
- 用人工校准报告替换该年份的自动抽取报告
