import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ClipboardList,
  RotateCcw,
  SearchX,
  Trash2,
} from 'lucide-react';
import { useTodoStore } from '../store/useTodoStore';
import type { Todo, TodoPriority } from '../types/todo';
import { filterTodos } from '../utils/todoFilters';
import TodoItem from './TodoItem';

/** 列表排序方式类型 */
type SortOption = 'createdAt' | 'priority' | 'dueDate';

/** 优先级权重映射（用于按优先级从高到低排序） */
const PRIORITY_WEIGHT: Record<TodoPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

interface TodoListProps {
  /** 触发编辑某条待办事项的回调 */
  onEditTodo: (todo: Todo) => void;
}

/**
 * 待办事项列表容器组件
 * 处理过滤后列表渲染、排序切换、批量清除已完成及两种空状态展示
 */
export default function TodoList({ onEditTodo }: TodoListProps) {
  const todos = useTodoStore((state) => state.todos);
  const filters = useTodoStore((state) => state.filters);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const resetFilters = useTodoStore((state) => state.resetFilters);

  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [confirmingClear, setConfirmingClear] = useState(false);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  const filteredAndSortedTodos = useMemo(() => {
    const filtered = filterTodos(todos, filters);

    return [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        const diff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        if (diff !== 0) return diff;
      }

      if (sortBy === 'dueDate') {
        if (a.dueDate && b.dueDate) {
          const diff = a.dueDate.localeCompare(b.dueDate);
          if (diff !== 0) return diff;
        } else if (a.dueDate && !b.dueDate) {
          return -1;
        } else if (!a.dueDate && b.dueDate) {
          return 1;
        }
      }

      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [todos, filters, sortBy]);

  // 空状态 1：没有任何待办事项
  if (todos.length === 0) {
    return (
      <section
        aria-label="待办事项列表"
        className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-2xs"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <ClipboardList className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">
          还没有任何待办事项
        </h3>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          在上方表单中添加你的第一条任务，开始高效规划今天吧！
        </p>
      </section>
    );
  }

  return (
    <section aria-label="待办事项列表" className="space-y-3">
      {/* 列表顶部工具栏：数量统计、排序选择与批量清除已完成 */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-xs font-medium text-slate-500 sm:text-sm">
          当前显示{' '}
          <span className="font-semibold text-slate-800">
            {filteredAndSortedTodos.length}
          </span>{' '}
          / {todos.length} 项任务
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {/* 排序方式切换 */}
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-600">
            <ArrowUpDown
              className="h-3.5 w-3.5 text-slate-400"
              aria-hidden="true"
            />
            <select
              aria-label="任务排序方式"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="createdAt">按创建时间（最新在前）</option>
              <option value="priority">按优先级（从高到低）</option>
              <option value="dueDate">按截止日期（最近优先）</option>
            </select>
          </div>

          {/* 批量清除已完成任务（带二次确认） */}
          {completedCount > 0 && (
            <div>
              {!confirmingClear ? (
                <button
                  type="button"
                  onClick={() => setConfirmingClear(true)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>清除已完成 ({completedCount})</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1">
                  <span className="text-xs font-medium text-rose-700">
                    确认清除 {completedCount} 项已完成任务？
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clearCompleted();
                      setConfirmingClear(false);
                    }}
                    className="cursor-pointer rounded bg-rose-600 px-2 py-0.5 text-xs font-medium text-white transition hover:bg-rose-700"
                  >
                    确认清除
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingClear(false)}
                    className="cursor-pointer rounded bg-white px-2 py-0.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 空状态 2：当前筛选或搜索无匹配结果 */}
      {filteredAndSortedTodos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-2xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <SearchX className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            没有找到匹配的待办事项
          </h3>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            请尝试调整搜索关键词或放宽筛选条件
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:text-sm"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>重置筛选条件</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onEdit={onEditTodo} />
          ))}
        </div>
      )}
    </section>
  );
}
