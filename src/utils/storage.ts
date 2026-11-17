import {
  STORAGE_KEY,
  VALID_CATEGORIES,
  VALID_PRIORITIES,
} from '../constants/todo';
import type { Todo, TodoCategory, TodoPriority } from '../types/todo';

/**
 * 生成唯一的待办事项 ID
 * 优先使用浏览器原生 crypto.randomUUID()，不支持时降级为时间戳+随机串
 */
export function generateTodoId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * 校验未知值是否为合法的 TodoCategory
 */
function isTodoCategory(value: unknown): value is TodoCategory {
  return (
    typeof value === 'string' &&
    (VALID_CATEGORIES as readonly string[]).includes(value)
  );
}

/**
 * 校验未知值是否为合法的 TodoPriority
 */
function isTodoPriority(value: unknown): value is TodoPriority {
  return (
    typeof value === 'string' &&
    (VALID_PRIORITIES as readonly string[]).includes(value)
  );
}

/**
 * 运行时类型守卫：校验单条数据是否符合 Todo 接口结构
 */
export function isValidTodo(item: unknown): item is Todo {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const record = item as Record<string, unknown>;

  const hasValidDueDate =
    record.dueDate === null || typeof record.dueDate === 'string';

  return (
    typeof record.id === 'string' &&
    record.id.trim().length > 0 &&
    typeof record.title === 'string' &&
    record.title.trim().length > 0 &&
    typeof record.description === 'string' &&
    isTodoCategory(record.category) &&
    isTodoPriority(record.priority) &&
    hasValidDueDate &&
    typeof record.completed === 'boolean' &&
    typeof record.createdAt === 'string'
  );
}

/**
 * 从 LocalStorage 安全读取待办事项列表
 * 若无数据、JSON 解析失败或数据损坏，自动过滤脏数据或降级为空数组
 */
export function loadTodos(): Todo[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidTodo);
  } catch (error) {
    console.warn('读取本地待办数据失败，已安全降级为空列表：', error);
    return [];
  }
}

/**
 * 将待办事项列表安全保存到 LocalStorage
 */
export function saveTodos(todos: Todo[]): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('保存待办数据到 LocalStorage 失败：', error);
  }
}
