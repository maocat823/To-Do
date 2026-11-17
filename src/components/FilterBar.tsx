import { Filter, RotateCcw, Search, X } from 'lucide-react';
import {
  CATEGORY_FILTER_OPTIONS,
  PRIORITY_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from '../constants/todo';
import { useTodoStore } from '../store/useTodoStore';
import type {
  TodoCategory,
  TodoPriority,
  TodoStatusFilter,
} from '../types/todo';
import { hasActiveFilters } from '../utils/todoFilters';

/**
 * 搜索与多条件组合筛选栏组件
 * 支持关键词模糊搜索、状态切换、分类筛选、优先级筛选及一键重置
 */
export default function FilterBar() {
  const filters = useTodoStore((state) => state.filters);
  const setSearchQuery = useTodoStore((state) => state.setSearchQuery);
  const setCategoryFilter = useTodoStore((state) => state.setCategoryFilter);
  const setPriorityFilter = useTodoStore((state) => state.setPriorityFilter);
  const setStatusFilter = useTodoStore((state) => state.setStatusFilter);
  const resetFilters = useTodoStore((state) => state.resetFilters);

  const isFiltered = hasActiveFilters(filters);

  return (
    <section
      aria-label="搜索与筛选任务"
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
    >
      <div className="flex flex-col gap-3">
        {/* 第一行：模糊搜索框 + 状态分段切换 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索待办标题或描述关键词..."
              aria-label="搜索待办标题或描述关键词"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pr-9 pl-10 text-sm text-slate-900 placeholder-slate-400 transition outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="清空搜索词"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-600"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* 完成状态筛选按钮组 */}
          <div
            role="group"
            aria-label="按完成状态筛选"
            className="inline-flex rounded-xl bg-slate-100 p-1"
          >
            {STATUS_FILTER_OPTIONS.map((option) => {
              const active = filters.status === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(option.value as TodoStatusFilter)
                  }
                  aria-pressed={active}
                  className={`flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition sm:flex-initial ${
                    active
                      ? 'bg-white text-indigo-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 第二行：分类筛选、优先级筛选与重置按钮 */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Filter className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>高级筛选：</span>
          </div>

          {/* 分类下拉筛选 */}
          <select
            aria-label="按分类筛选"
            value={filters.category}
            onChange={(e) =>
              setCategoryFilter(e.target.value as TodoCategory | 'all')
            }
            className="rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          >
            {CATEGORY_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* 优先级下拉筛选 */}
          <select
            aria-label="按优先级筛选"
            value={filters.priority}
            onChange={(e) =>
              setPriorityFilter(e.target.value as TodoPriority | 'all')
            }
            className="rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          >
            {PRIORITY_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* 重置筛选按钮 */}
          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto inline-flex cursor-pointer items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>重置筛选</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
