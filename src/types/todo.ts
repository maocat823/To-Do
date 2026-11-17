/** 任务优先级：低、中、高 */
export type TodoPriority = 'low' | 'medium' | 'high';

/** 任务分类：工作、学习、生活、个人、其他 */
export type TodoCategory = 'work' | 'study' | 'life' | 'personal' | 'other';

/** 完成状态筛选类型：全部、未完成、已完成 */
export type TodoStatusFilter = 'all' | 'active' | 'completed';

/** 截止日期状态类型：已逾期、今日到期、未到期、无截止日期（或已完成） */
export type DueDateStatus = 'overdue' | 'today' | 'upcoming' | 'none';

/** 待办事项实体 */
export interface Todo {
  /** 唯一标识（如 crypto.randomUUID()） */
  id: string;
  /** 标题（必填） */
  title: string;
  /** 描述（可选，默认空字符串） */
  description: string;
  /** 任务分类 */
  category: TodoCategory;
  /** 任务优先级 */
  priority: TodoPriority;
  /** 截止日期（YYYY-MM-DD 格式字符串或 null） */
  dueDate: string | null;
  /** 是否已完成 */
  completed: boolean;
  /** 创建时间（ISO 8601 字符串） */
  createdAt: string;
}

/** 创建/编辑待办时的表单载荷 */
export type TodoFormInput = Pick<
  Todo,
  'title' | 'description' | 'category' | 'priority' | 'dueDate'
>;

/** 筛选与搜索状态 */
export interface TodoFilters {
  /** 搜索关键词（匹配标题和描述） */
  searchQuery: string;
  /** 分类筛选 */
  category: TodoCategory | 'all';
  /** 优先级筛选 */
  priority: TodoPriority | 'all';
  /** 完成状态筛选 */
  status: TodoStatusFilter;
}

/** 统计数据模型 */
export interface TodoStats {
  /** 总任务数 */
  total: number;
  /** 已完成任务数 */
  completed: number;
  /** 待完成任务数 */
  active: number;
  /** 完成率（0 - 100 整数） */
  completionRate: number;
  /** 未完成且已逾期的任务数 */
  overdue: number;
}

/** 分类展示配置项 */
export interface CategoryConfig {
  value: TodoCategory;
  label: string;
  badgeClass: string;
}

/** 优先级展示配置项 */
export interface PriorityConfig {
  value: TodoPriority;
  label: string;
  badgeClass: string;
  dotClass: string;
}
