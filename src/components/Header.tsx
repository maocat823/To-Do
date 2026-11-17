import { format } from 'date-fns';
import { CalendarDays, CheckSquare } from 'lucide-react';

/**
 * 应用顶部标题与日期展示栏组件
 */
export default function Header() {
  const todayStr = format(new Date(), 'yyyy年MM月dd日');

  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <CheckSquare className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            待办事项管理
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            高效规划日常工作、学习与生活任务
          </p>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs sm:self-auto">
        <CalendarDays className="h-4 w-4 text-indigo-600" aria-hidden="true" />
        <span>今天是 {todayStr}</span>
      </div>
    </header>
  );
}
