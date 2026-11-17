import { DEFAULT_FILTERS } from '../constants/todo';
import type { Todo, TodoFilters, TodoStats } from '../types/todo';
import { isTodoOverdue } from './date';

/**
 * 多条件组合过滤与模糊搜索纯函数
 * 同时匹配状态、分类、优先级，并在标题与描述中执行不区分大小写的模糊匹配
 */
export function filterTodos(todos: Todo[], filters: TodoFilters): Todo[] {
  const keyword = filters.searchQuery.trim().toLowerCase();

  return todos.filter((todo) => {
    // 1. 完成状态筛选
    if (filters.status === 'active' && todo.completed) {
      return false;
    }
    if (filters.status === 'completed' && !todo.completed) {
      return false;
    }

    // 2. 分类筛选
    if (filters.category !== 'all' && todo.category !== filters.category) {
      return false;
    }

    // 3. 优先级筛选
    if (filters.priority !== 'all' && todo.priority !== filters.priority) {
      return false;
    }

    // 4. 关键词模糊搜索（匹配 title 和 description，不区分大小写）
    if (keyword.length > 0) {
      const matchTitle = todo.title.toLowerCase().includes(keyword);
      const matchDesc = todo.description.toLowerCase().includes(keyword);
      if (!matchTitle && !matchDesc) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 基于全量待办数据计算统计指标（不受当前筛选结果影响）
 */
export function calculateTodoStats(todos: Todo[]): TodoStats {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const active = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  const overdue = todos.filter((todo) =>
    isTodoOverdue(todo.dueDate, todo.completed)
  ).length;

  return {
    total,
    completed,
    active,
    completionRate,
    overdue,
  };
}

/**
 * 判断当前是否存在任何激活的筛选条件或搜索关键词
 */
export function hasActiveFilters(filters: TodoFilters): boolean {
  return (
    filters.searchQuery.trim() !== DEFAULT_FILTERS.searchQuery ||
    filters.category !== DEFAULT_FILTERS.category ||
    filters.priority !== DEFAULT_FILTERS.priority ||
    filters.status !== DEFAULT_FILTERS.status
  );
}
