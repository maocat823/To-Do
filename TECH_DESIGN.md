# 待办事项应用（进阶版）技术设计文档

## 1. 技术选型

| 类别 | 选型方案 | 说明 |
| --- | --- | --- |
| 构建工具 | Vite | 快速的本地开发服务器与生产构建打包工具 |
| 前端框架 | React 18+ & TypeScript | 函数式组件开发，提供严格的静态类型检查 |
| 状态管理 | Zustand | 轻量级全局状态管理，API 简洁，集中管理 Todo 数据与筛选状态 |
| 样式方案 | Tailwind CSS | 原子化 CSS 框架，快速构建现代化响应式界面 |
| 日期处理 | date-fns | 轻量模块化日期库，用于格式化截止日期及逾期/今日到期计算 |
| 数据存储 | Browser LocalStorage | 本地持久化存储，刷新页面数据不丢失 |
| 图标库 | lucide-react | 轻量美观的开源 SVG 图标库（可选但推荐） |

---

## 2. 项目目录结构

```text
D:\To-Do\
├── public/                     # 静态资源
├── src/
│   ├── constants/
│   │   └── todo.ts             # 分类选项、优先级配置、LocalStorage Key 等常量
│   ├── types/
│   │   └── todo.ts             # Todo、筛选条件、统计数据等 TypeScript 类型定义
│   ├── utils/
│   │   ├── storage.ts          # LocalStorage 读写与容错校验封装
│   │   ├── date.ts             # 基于 date-fns 的日期格式化与逾期判断工具
│   │   └── todoFilters.ts      # 多条件筛选、模糊搜索与统计计算的纯函数
│   ├── store/
│   │   └── useTodoStore.ts     # Zustand 全局状态管理 Store
│   ├── components/
│   │   ├── Header.tsx          # 应用顶部标题与简介/操作栏
│   │   ├── StatsPanel.tsx      # 统计看板（总数、已完成、待办数、完成率、逾期数）
│   │   ├── AddTodoForm.tsx     # 添加待办表单与输入验证
│   │   ├── FilterBar.tsx       # 搜索框 + 分类/优先级/状态多条件筛选 + 重置按钮
│   │   ├── TodoList.tsx        # 待办列表容器与空状态处理
│   │   ├── TodoItem.tsx        # 单条待办卡片（勾选、展示标签、编辑/删除触发）
│   │   └── EditTodoModal.tsx   # 编辑待办弹窗（支持修改全部字段与表单校验）
│   ├── App.tsx                 # 页面主布局与组件组装
│   ├── main.tsx                # 应用入口
│   └── index.css               # Tailwind CSS 引入与全局基础样式
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js          # 若使用 Tailwind v3；v4 则按 @tailwindcss/vite 配置
├── PRD.md                      # 产品需求文档
├── TECH_DESIGN.md              # 技术设计文档
└── AGENTS.md                   # AI 开发规范指南
```

---

## 3. 核心数据模型设计

在 `src/types/todo.ts` 中定义核心类型：

```typescript
/** 任务优先级：低、中、高 */
export type TodoPriority = 'low' | 'medium' | 'high';

/** 任务分类 */
export type TodoCategory = 'work' | 'study' | 'life' | 'personal' | 'other';

/** 完成状态筛选类型 */
export type TodoStatusFilter = 'all' | 'active' | 'completed';

/** 待办事项实体 */
export interface Todo {
  id: string;                  // 唯一标识（如 crypto.randomUUID()）
  title: string;               // 标题（必填）
  description: string;         // 描述（可选，默认空字符串）
  category: TodoCategory;      // 分类
  priority: TodoPriority;      // 优先级
  dueDate: string | null;      // 截止日期（YYYY-MM-DD 格式字符串或 null）
  completed: boolean;          // 是否完成
  createdAt: string;           // 创建时间（ISO 8601 字符串）
}

/** 创建/编辑待办时的表单载荷 */
export type TodoFormInput = Pick<
  Todo,
  'title' | 'description' | 'category' | 'priority' | 'dueDate'
>;

/** 筛选与搜索状态 */
export interface TodoFilters {
  searchQuery: string;
  category: TodoCategory | 'all';
  priority: TodoPriority | 'all';
  status: TodoStatusFilter;
}

/** 统计数据模型 */
export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;      // 0 - 100 的整数或保留一位小数
  overdue: number;             // 未完成且已逾期的数量
}
```

---

## 4. 数据存储层设计（`src/utils/storage.ts`）

- **Storage Key**：统一定义常量 `STORAGE_KEY = 'advanced_todo_items_v1'`。
- **封装方法**：
  - `loadTodos(): Todo[]`
    - 使用 `try / catch` 读取 `localStorage.getItem(STORAGE_KEY)`。
    - 若不存在或 JSON 解析失败，返回 `[]`。
    - 对解析结果进行基础数组与必填字段校验（确保每项具备 `id`、`title`、`completed` 等合法结构），过滤异常脏数据。
  - `saveTodos(todos: Todo[]): void`
    - 使用 `try / catch` 执行 `localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))`，防止隐私模式或容量超限抛出未捕获异常。

---

## 5. 状态管理设计（`src/store/useTodoStore.ts`）

使用 Zustand 创建单一 Store 管理核心状态，并在数据变更时自动同步到 `LocalStorage`（也可配合存储工具函数在 action 中显式持久化，确保可控和类型安全）：

### 5.1 State 定义
- `todos: Todo[]` —— 初始值通过 `loadTodos()` 加载。
- `filters: TodoFilters` —— 默认值：`{ searchQuery: '', category: 'all', priority: 'all', status: 'all' }`。

### 5.2 Actions 定义
- `addTodo(input: TodoFormInput): void`
  - 生成 `id` 与 `createdAt`，设置 `completed: false`，插入到列表头部（最新在前），并调用 `saveTodos` 持久化。
- `updateTodo(id: string, updates: Partial<TodoFormInput>): void`
  - 根据 `id` 更新对应待办字段，并持久化。
- `deleteTodo(id: string): void`
  - 过滤掉指定 `id` 的待办，并持久化。
- `toggleTodo(id: string): void`
  - 反转指定 `id` 的 `completed` 状态，并持久化。
- `clearCompleted(): void`
  - 移除所有 `completed === true` 的待办，并持久化。
- `setSearchQuery(query: string): void`
- `setCategoryFilter(category: TodoCategory | 'all'): void`
- `setPriorityFilter(priority: TodoPriority | 'all'): void`
- `setStatusFilter(status: TodoStatusFilter): void`
- `resetFilters(): void`

---

## 6. 核心业务逻辑设计

### 6.1 多条件筛选与模糊搜索（`src/utils/todoFilters.ts`）
将过滤逻辑抽离为纯函数 `filterTodos(todos: Todo[], filters: TodoFilters): Todo[]`，便于复用与单元测试：
1. **状态匹配**：
   - `all`：全部通过
   - `active`：`!todo.completed`
   - `completed`：`todo.completed`
2. **分类匹配**：`filters.category === 'all' || todo.category === filters.category`
3. **优先级匹配**：`filters.priority === 'all' || todo.priority === filters.priority`
4. **模糊搜索匹配**：
   - 将 `filters.searchQuery.trim().toLowerCase()` 作为 `keyword`。
   - 若 `keyword` 非空，校验 `todo.title.toLowerCase().includes(keyword) || todo.description.toLowerCase().includes(keyword)`。

### 6.2 统计数据计算（`src/utils/todoFilters.ts`）
抽离纯函数 `calculateTodoStats(todos: Todo[]): TodoStats`：
- 基于全量 `todos` 计算（不受当前筛选条件影响，保证全局视角准确）：
  - `total = todos.length`
  - `completed = todos.filter(t => t.completed).length`
  - `active = total - completed`
  - `completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)`
  - `overdue`：统计 `!todo.completed && isTodoOverdue(todo.dueDate)` 的数量。

### 6.3 日期处理（`src/utils/date.ts`）
使用 `date-fns` 进行可靠日期运算：
- `formatDueDate(dueDate: string | null): string`：使用 `parseISO` + `format` 格式化为可读日期（如 `2026-11-20` 或 `11月20日`）。
- `getDueDateStatus(dueDate: string | null, completed: boolean): 'overdue' | 'today' | 'upcoming' | 'none'`：
  - 若 `completed` 为 `true` 或无 `dueDate`，不做逾期警告（返回 `'none'` 或正常显示）。
  - 使用 `isBefore(startOfDay(parsed), startOfDay(new Date()))` 判断是否逾期（`'overdue'`）。
  - 使用 `isToday(parsed)` 判断是否今日到期（`'today'`）。
  - 其余返回 `'upcoming'`。

---

## 7. 组件设计与职责划分

1. **`StatsPanel.tsx`**：订阅 `todos`，调用 `calculateTodoStats` 展示统计卡片与完成率进度条。
2. **`AddTodoForm.tsx`**：受控表单，支持输入标题、描述、选择分类、优先级、截止日期；校验标题非空；提交后调用 `addTodo` 并重置表单。
3. **`FilterBar.tsx`**：包含搜索框（带清空按钮）、状态/分类/优先级筛选控件，以及条件激活时的“重置筛选”按钮。
4. **`TodoList.tsx`**：订阅 `todos` 和 `filters`，计算过滤后的列表；区分“总数据为空”和“筛选结果为空”两种空状态，提供批量清除已完成按钮。
5. **`TodoItem.tsx`**：展示单条待办内容、优先级徽章、分类标签、截止日期状态标识；提供切换完成、打开编辑弹窗、删除（含确认）交互。
6. **`EditTodoModal.tsx`**：点击编辑时弹出，预填当前待办字段，复用表单验证规则，支持保存更新或取消关闭（支持 `Esc` 关闭）。

---

## 8. 建议开发顺序

按照模块依赖由底向上的顺序渐进实现与验证：
1. **初始化工程**：使用 Vite 初始化 React + TypeScript 项目，配置 Tailwind CSS，安装 `zustand`、`date-fns`、`lucide-react`。
2. **数据与工具层**：实现 `src/types/todo.ts`、`src/constants/todo.ts`、`src/utils/storage.ts`、`src/utils/date.ts`、`src/utils/todoFilters.ts`。
3. **状态管理层**：实现 `src/store/useTodoStore.ts`。
4. **核心 UI 组件**：依次实现 `StatsPanel` -> `AddTodoForm` -> `FilterBar` -> `TodoItem` / `TodoList` -> `EditTodoModal`。
5. **联调与自测**：在 `App.tsx` 组装完整界面，测试增删改查、组合筛选、模糊搜索、刷新持久化与移动端响应式布局，执行 `npm run build` 确认无 TypeScript 和打包报错。
