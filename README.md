# 待办事项管理应用（进阶版）

一个基于 **React + TypeScript + Vite + Zustand + Tailwind CSS + date-fns** 构建的现代化个人待办事项管理应用（Advanced To-Do App）。支持多维度任务属性管理、多条件交集筛选、标题与描述实时模糊搜索、全局数据统计看板以及浏览器 `LocalStorage` 本地持久化存储。

---

## ✨ 核心功能

- **多维度任务管理（CRUD）**
  - **创建待办**：支持录入任务标题（必填校验）、详细描述、分类（`工作` / `学习` / `生活` / `个人` / `其他`）、优先级（`高` / `中` / `低`）及截止日期。
  - **状态切换**：一键勾选完成/未完成状态，已完成任务自动添加删除线并弱化视觉层级。
  - **编辑任务**：弹窗式编辑全部字段，支持表单非空校验与 `Esc` 快捷键关闭。
  - **防误删保护**：单条删除与“清除已完成”批量清理均内置内联二次确认机制。
- **多条件组合筛选 & 模糊搜索**
  - **交集过滤**：支持按**完成状态**（全部 / 未完成 / 已完成）、**任务分类**、**优先级**任意组合筛选。
  - **实时搜索**：同时匹配任务**标题**与**描述**，不区分大小写，支持一键清空与“重置筛选”。
  - **灵活排序**：支持按创建时间（最新在前）、优先级（从高到低）、截止日期（最近优先）排序。
- **实时统计看板 & 到期提醒**
  - **全局统计**：基于全量数据实时展示**总任务数**、**待完成**、**已完成**、**已逾期**数量及**完成率进度条**。
  - **到期状态识别**：基于 `date-fns` 自动识别并高亮标注未完成任务的**“已逾期”**（红色警示）与**“今日到期”**（琥珀色提示）状态。
- **可靠的数据持久化**
  - 所有任务变更自动同步至浏览器 `LocalStorage`，刷新或重新打开页面数据不丢失。
  - 内置运行时类型守卫（Type Guard）与 `try / catch` 异常容错，自动过滤损坏数据并安全降级。
- **响应式与无障碍体验**
  - 兼容桌面端与移动端视口，区分“无任何任务”与“筛选无匹配结果”两种空状态。

---

## 🛠️ 技术栈

| 类别 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **前端框架** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | 函数式组件 + Hooks，启用 `strict` 严格类型检查 |
| **构建工具** | [Vite 6](https://vite.dev/) | 极速本地开发服务器与生产环境打包 |
| **状态管理** | [Zustand 5](https://zustand.docs.pmnd.rs/) | 轻量级全局状态管理，精细化 Selector 订阅 |
| **样式方案** | [Tailwind CSS v4](https://tailwindcss.com/) | 原子化 CSS 构建现代卡片式响应式界面 |
| **日期工具** | [date-fns 4](https://date-fns.org/) | 日期格式化、今日到期与逾期状态计算 |
| **图标库** | [lucide-react](https://lucide.dev/) | 简洁一致的开源 SVG 图标组件 |
| **数据存储** | Browser `LocalStorage` | 本地持久化存储与容错校验封装 |

---

## 📁 目录结构

```text
To-Do/
├── public/                     # 静态资源
├── src/
│   ├── constants/
│   │   └── todo.ts             # 分类、优先级文案与语义色映射、Storage Key 等常量
│   ├── types/
│   │   └── todo.ts             # Todo、筛选条件、统计数据等核心 TypeScript 接口定义
│   ├── utils/
│   │   ├── storage.ts          # LocalStorage 安全读写与运行时类型守卫
│   │   ├── date.ts             # 基于 date-fns 的日期格式化与逾期/今日到期判断
│   │   └── todoFilters.ts      # 多条件交集过滤、模糊搜索与统计计算纯函数
│   ├── store/
│   │   └── useTodoStore.ts     # Zustand 全局状态管理 Store
│   ├── components/
│   │   ├── Header.tsx          # 顶部标题与今日日期展示栏
│   │   ├── StatsPanel.tsx      # 任务统计看板与完成率进度条
│   │   ├── AddTodoForm.tsx     # 添加待办表单与内联验证
│   │   ├── FilterBar.tsx       # 搜索框 + 状态/分类/优先级组合筛选 + 重置按钮
│   │   ├── TodoList.tsx        # 待办列表容器、排序、批量清理与双空状态处理
│   │   ├── TodoItem.tsx        # 单条待办卡片（勾选、标签徽章、编辑与删除确认）
│   │   └── EditTodoModal.tsx   # 编辑待办弹窗
│   ├── App.tsx                 # 页面主视图与组件组装
│   ├── main.tsx                # 应用入口
│   └── index.css               # Tailwind CSS 引入
├── PRD.md                      # 产品需求文档
├── TECH_DESIGN.md              # 技术设计文档
├── AGENTS.md                   # AI 开发规范指南
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 快速开始

### 1. 环境要求
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### 2. 安装依赖
```bash
npm install
```

### 3. 启动本地开发服务器
```bash
npm run dev
```
启动后在浏览器访问终端输出的本地地址（通常为 `http://localhost:5173`）。

### 4. 类型检查与生产构建
```bash
# 运行 TypeScript 静态类型检查
npx tsc --noEmit

# 构建生产环境产物（输出至 dist/ 目录）
npm run build

# 本地预览生产构建产物
npm run preview
```

---

## 📄 工程文档

本项目遵循规范化的文档驱动开发流程，详细设计请参考：
- [产品需求文档（PRD.md）](./PRD.md) —— 核心功能范围、交互要求与验收清单
- [技术设计文档（TECH_DESIGN.md）](./TECH_DESIGN.md) —— 架构分层、数据模型与模块设计
- [开发规范指南（AGENTS.md）](./AGENTS.md) —— 代码规范、分层约束与验证流程

---

## 🗺️ 后续扩展方向（Roadmap）

- [ ] **多标签系统**：支持为单条待办添加多个自定义标签（Tags）
- [ ] **子任务拆解**：支持在待办内部创建子任务列表并统计子任务进度
- [ ] **浏览器到期通知**：结合 Notification API 在截止日期前推送提醒
- [ ] **数据导入与导出**：支持导出为 JSON / CSV 文件备份及从文件恢复
- [ ] **云端同步**：接入 Supabase / Firebase 实现多端数据同步

---

## 📝 开源协议

本项目基于 [MIT License](./LICENSE) 开源。
