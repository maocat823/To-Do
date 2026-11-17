import type {
  CategoryConfig,
  PriorityConfig,
  TodoCategory,
  TodoFilters,
  TodoPriority,
  TodoStatusFilter,
} from '../types/todo';

/** LocalStorage 持久化存储键名 */
export const STORAGE_KEY = 'advanced_todo_items_v1';

/** 默认筛选条件 */
export const DEFAULT_FILTERS: TodoFilters = {
  searchQuery: '',
  category: 'all',
  priority: 'all',
  status: 'all',
};

/** 合法分类枚举值列表（用于运行时校验与遍历） */
export const VALID_CATEGORIES: readonly TodoCategory[] = [
  'work',
  'study',
  'life',
  'personal',
  'other',
] as const;

/** 合法优先级枚举值列表（用于运行时校验与遍历） */
export const VALID_PRIORITIES: readonly TodoPriority[] = [
  'high',
  'medium',
  'low',
] as const;

/** 任务分类显示名称与样式映射 */
export const CATEGORY_MAP: Record<TodoCategory, CategoryConfig> = {
  work: {
    value: 'work',
    label: '工作',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  study: {
    value: 'study',
    label: '学习',
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  life: {
    value: 'life',
    label: '生活',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  personal: {
    value: 'personal',
    label: '个人',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  other: {
    value: 'other',
    label: '其他',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

/** 任务分类下拉选项列表（用于添加和编辑表单） */
export const CATEGORY_OPTIONS: CategoryConfig[] = VALID_CATEGORIES.map(
  (category) => CATEGORY_MAP[category]
);

/** 任务分类筛选选项列表（含“全部分类”） */
export const CATEGORY_FILTER_OPTIONS: Array<{
  value: TodoCategory | 'all';
  label: string;
}> = [
  { value: 'all', label: '全部分类' },
  ...CATEGORY_OPTIONS.map(({ value, label }) => ({ value, label })),
];

/** 任务优先级显示名称与语义化颜色映射 */
export const PRIORITY_MAP: Record<TodoPriority, PriorityConfig> = {
  high: {
    value: 'high',
    label: '高优先级',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
  },
  medium: {
    value: 'medium',
    label: '中优先级',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  low: {
    value: 'low',
    label: '低优先级',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    dotClass: 'bg-sky-500',
  },
};

/** 任务优先级下拉选项列表（用于添加和编辑表单） */
export const PRIORITY_OPTIONS: PriorityConfig[] = VALID_PRIORITIES.map(
  (priority) => PRIORITY_MAP[priority]
);

/** 任务优先级筛选选项列表（含“全部优先级”） */
export const PRIORITY_FILTER_OPTIONS: Array<{
  value: TodoPriority | 'all';
  label: string;
}> = [
  { value: 'all', label: '全部优先级' },
  { value: 'high', label: '高优先级' },
  { value: 'medium', label: '中优先级' },
  { value: 'low', label: '低优先级' },
];

/** 任务状态筛选选项列表 */
export const STATUS_FILTER_OPTIONS: Array<{
  value: TodoStatusFilter;
  label: string;
}> = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'completed', label: '已完成' },
];
