# Primary English Grammar Quiz UI Refresh

## Design Goal

把当前“练习工具”体验升级成“学习产品”体验。

核心目标：

- 让孩子一眼知道“先做什么、再看什么”
- 让家长/老师一眼看到 AI 是否正常、当前练习状态、学习结果
- 让“AI 讲解”成为主角，而不是提交后的附属说明
- 让“错题再练”变成自然的下一步，而不是页面底部的信息堆积

## Visual Direction

关键词：

- bright
- encouraging
- teacher-like
- structured
- calm tech

视觉基调：

- 主色用清爽蓝色，表达“学习引导”和“可信赖”
- 辅色用橙色，强调行动按钮、提示和学习热度
- 背景用柔和蓝白到奶油色渐变，不走纯白后台风
- 卡片圆角更大，弱化后台工具感
- 信息层级更清楚，避免所有信息都长得一样

## Suggested Tokens

### Colors

- Primary: `#1E74FF`
- Primary Deep: `#183C88`
- Accent Orange: `#FF9458`
- Accent Warm: `#FFF2E9`
- Success: `#1D7A46`
- Success Surface: `#E6F6ED`
- Ink: `#172033`
- Secondary Text: `#62708A`
- Card Border: `#DCE5F3`
- Card Fill: `#FFFFFF`
- Soft Blue Surface: `#F8FBFF`
- Page Background: `#F6F9FF`

### Radius

- Page shell: `36`
- Primary card: `30`
- Secondary card: `22-24`
- Pills: `999`
- Inputs / chips: `14-20`

### Shadows

- Main card shadow: `0 18 36 rgba(23, 32, 51, 0.08)`
- Hero shadow: `0 22 40 rgba(24, 60, 136, 0.18)`

## Typography

建议字体方向：

- UI: `Inter`
- If later implemented on web: keep a modern sans stack, but avoid old default feel

字号建议：

- Hero title: `46`
- Page title: `28-30`
- Card title: `22-24`
- Section label: `15-16`
- Body: `14-16`
- Meta / hint: `12-13`

## Screen 1: Home / Setup

### Intent

首页不再只是“登录 + 表单设置”，而是“学习任务总览”。

### Layout

- Top navigation
- Large hero
- Left setup rail
- Right learning dashboard

### Top Navigation

包含：

- Brand block: `Primary English Coach`
- Small product promise
- Status pills:
  - `AI 已连接`
  - `题库 6,000+`
- Main CTA: `开始新练习`

### Hero

左侧：

- 标题：`让孩子不是只做对题，而是真的听懂每一道题`
- 一段说明
- 两个 CTA：
  - `进入今日练习`
  - `查看错题报告`

右侧：

- 今日学习节奏卡
- 两个核心数字：
  - 本轮题数
  - 正确率
- AI 讲解风格说明卡

### Left Setup Rail

内容顺序：

1. 登录状态
2. 练习模式
3. 题型选择
4. 题量建议
5. AI 状态卡
6. 主行动按钮

改造重点：

- 把原来长表单拆成多个语义卡片
- 让“开始做题”成为强主按钮
- AI 状态不要只显示技术状态，要给可理解文案

### Right Learning Dashboard

内容：

- 学习流程总览
  - 登录确认
  - 选模式 / 题型
  - 开始做题
  - AI 逐题讲解
  - 错题再练
- 首页任务卡
- 进度状态卡
- 讲解能力说明卡

## Screen 2: Practice / AI Explain

### Intent

答题页的核心不只是“提交”，而是“提交后立即理解”。

### Layout

- Top progress header
- Left question panel
- Right explanation column

### Top Progress Header

包含：

- 标题：`答题页 + AI 讲解页`
- 进度 pill
- 正确率 pill
- 错题自动进入再练提示
- 当前考点标签

### Left Question Panel

内容：

- 题型标签
- 大号题目正文
- 一句老师式提示
- 四个更大的选项卡
- 固定感更强的提交区域

改造重点：

- 选项点击面积更大
- 信息密度下降
- 题目阅读路径更顺

### Right Explanation Column

分成三个模块：

1. 本题反馈
2. AI 老师讲解
3. 错题再练入口

#### 本题反馈

- 回答是否正确
- 你的答案
- 正确答案
- 简短情绪文案

#### AI 老师讲解

固定三段式：

- 这题在考什么
- 为什么这个答案对
- 下次怎么更快看出来

要求：

- 中文
- 小学老师口吻
- 有鼓励感
- 不讲太抽象的语法术语

#### 错题再练入口

- 以任务列表形式呈现
- 展示 2-3 个待重练知识点
- 主按钮：`开始错题再练`

## Interaction Notes

- Home 页的状态和任务卡需要更像“开始学习前的准备台”
- Practice 页提交后，不要让用户去找讲解，讲解应该自然展开在右侧
- 错题再练不要埋在总结页底部，应该成为清晰的下一步
- AI 异常时文案建议：
  - `AI 暂时不可用，系统会提供基础讲解`
  - 避免直接暴露 `fallback`、`429`、`402`

## Implementation Priority

如果后面要落地前端，推荐顺序：

1. 重做页面骨架和信息布局
2. 重做首页 setup rail
3. 重做答题页左右分栏
4. 重做 AI 讲解卡
5. 重做错题再练入口
6. 最后再统一动效和细节

## Figma Notes

已创建 Figma 文件：

- `Primary English Grammar Quiz - UI Refresh`
- URL: `https://www.figma.com/design/RboYjUrMLHvoFLnLDzcvsh`

当前阻塞：

- Figma MCP Starter plan tool call limit reached

恢复后建议直接产出：

- Desktop Home screen
- Desktop Practice + AI Explain screen
- Optional mobile adaptation
