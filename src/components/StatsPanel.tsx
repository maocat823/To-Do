import { useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
} from 'lucide-react';
import { useTodoStore } from '../store/useTodoStore';
import { calculateTodoStats } from '../utils/todoFilters';

/**
 * 任务统计看板组件
 * 基于全量待办数据实时展示总数、待完成、已完成、逾期数及完成率进度条
 */
export default function StatsPanel() {
  const todos = useTodoStore((state) => state.todos);

  const stats = useMemo(() => calculateTodoStats(todos), [todos]);

  return (
    <section aria-label="任务统计看板" className="mb-6 space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* 总任务数 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">总任务数</span>
            <span className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
              <ListTodo className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {stats.total}
          </p>
        </div>

        {/* 待完成数 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">待完成</span>
            <span className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
              <Clock className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-indigo-600">
            {stats.active}
          </p>
        </div>

        {/* 已完成数 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">已完成</span>
            <span className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {stats.completed}
          </p>
        </div>

        {/* 已逾期数 */}
        <div
          className={`rounded-xl border p-4 shadow-2xs ${
            stats.overdue > 0
              ? 'border-rose-200 bg-rose-50/50'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium ${
                stats.overdue > 0 ? 'text-rose-700' : 'text-slate-500'
              }`}
            >
              已逾期
            </span>
            <span
              className={`rounded-lg p-1.5 ${
                stats.overdue > 0
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p
            className={`mt-2 text-2xl font-bold ${
              stats.overdue > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {stats.overdue}
          </p>
        </div>
      </div>

      {/* 完成率进度条卡片 */}
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-2xs">
        <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
            <TrendingUp
              className="h-4 w-4 text-indigo-600"
              aria-hidden="true"
            />
            整体完成进度
          </span>
          <span className="font-semibold text-indigo-600">
            {stats.completed} / {stats.total} 项（{stats.completionRate}%）
          </span>
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={stats.completionRate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="任务完成率"
        >
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
    </section>
  );
}
