# DESIGN.md

## 项目与用户画像
- 农庄多功能小程序，面向游客和农庄管理员
- 前端(staryu-uniapp)：移动端小程序风格，面向C端用户
- 后端(staryu-web)：管理后台，面向B端管理员

## 品牌与视觉方向
- 主色调：绿色系（#16a34a / green-600），体现农庄自然生态主题
- 辅助色：橙色（状态提示）、蓝色（信息展示）、灰色（辅助文本）
- 风格关键词：清新、自然、简洁、实用

## Design Tokens

### 色彩
- 主色：green-600 (#16a34a)
- 前景文字：gray-900
- 辅助文字：gray-500 / gray-400
- 背景：gray-50 / white
- 成功态：green-100 / green-700
- 警告态：orange-100 / orange-600
- 错误态：red-100 / red-600

### 圆角
- 卡片/按钮：rounded-xl (12px)
- 标签/小按钮：rounded-full / rounded-lg

## 移动端适配
- staryu-uniapp 最大宽度 480px，居中显示
- 底部 TabBar 高度 56px，含安全区域
