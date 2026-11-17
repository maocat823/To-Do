import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  Pencil,
  Trash2,
} from 'lucide-react';
import { CATEGORY_MAP, PRIORITY_MAP } from '../constants/todo';
import { useTodoStore } from '../store/useTodoStore';
import type { Todo } from '../types/todo';
import {
  formatCreatedAt,
  getDueDateLabel,
  getDueDateStatus,
} from '../utils/date';

interface TodoItemProps {
  /** 单条待办数据 */
  todo: Todo;
  /** 点击编辑按钮时的回调 */
  onEdit: (todo: Todo) => void;
}

/**
 * 单条待办事项卡片组件
 * 支持切换完成状态、展示多维度标签与逾期警示、触发编辑与二次确认删除
 */
export default function TodoItem({ todo, onEdit }: TodoItemProps) {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const categoryConfig = CATEGORY_MAP[todo.category];
  const priorityConfig = PRIORITY_MAP[todo.priority];
  const dueDateStatus = getDueDateStatus(todo.dueDate, todo.completed);
  const dueDateLabel = getDueDateLabel(todo.dueDate, todo.completed);

  const dueDateBadgeClass =
    dueDateStatus === 'overdue'
      ? 'bg-rose-50 text-rose-700 border-rose-200 font-medium'
      : dueDateStatus === 'today'
        ? 'bg-amber-50 text-amber-700 border-amber-200 font-medium'
        : 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <article
      className={`group rounded-2xl border p-4 transition-all ${
        todo.completed
          ? 'border-slate-200/80 bg-slate-50/70 opacity-75'
          : dueDateStatus === 'overdue'
            ? 'border-rose-200 bg-white shadow-2xs hover:border-rose-300'
            : 'border-slate-200 bg-white shadow-2xs hover:border-indigo-200 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* 完成状态勾选框 */}
        <button
          type="button"
          onClick={() => toggleTodo(todo.id)}
          aria-label={
            todo.completed
              ? `将“${todo.title}”标记为未完成`
              : `将“${todo.title}”标记为已完成`
          }
          aria-pressed={todo.completed}
          className={`mt-0.5 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border transition focus:ring-2 focus:ring-indigo-500/30 focus:outline-none ${
            todo.completed
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-slate-300 bg-white hover:border-indigo-500'
          }`}
        >
          {todo.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
        </button>

        {/* 主体内容区 */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h3
              className={`text-sm font-semibold break-words sm:text-base ${
                todo.completed
                  ? 'text-slate-400 line-through'
                  : 'text-slate-900'
              }`}
            >
              {todo.title}
            </h3>

            {/* 操作按钮区 */}
            <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-start">
              {!confirmingDelete ? (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit(todo)}
                    aria-label={`编辑“${todo.title}”`}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>编辑</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    aria-label={`删除“${todo.title}”`}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>删除</span>
                  </button>
                </>
              ) : (
                <div className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1">
                  <span className="text-xs font-medium text-rose-700">
                    确认删除？
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTodo(todo.id)}
                    className="cursor-pointer rounded bg-rose-600 px-2 py-0.5 text-xs font-medium text-white transition hover:bg-rose-700"
                  >
                    确认
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="cursor-pointer rounded bg-white px-2 py-0.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 任务描述 */}
          {todo.description && (
            <p
              className={`mt-1 text-xs break-words whitespace-pre-line sm:text-sm ${
                todo.completed ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* 标签与日期元信息栏 */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {/* 分类徽章 */}
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 font-medium ${categoryConfig.badgeClass}`}
            >
              {categoryConfig.label}
            </span>

            {/* 优先级徽章 */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-medium ${priorityConfig.badgeClass}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${priorityConfig.dotClass}`}
                aria-hidden="true"
              />
              {priorityConfig.label}
            </span>

            {/* 截止日期徽章 */}
            {dueDateLabel && (
              <span
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 ${dueDateBadgeClass}`}
              >
                {dueDateStatus === 'overdue' ? (
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                ) : dueDateStatus === 'today' ? (
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{dueDateLabel}</span>
              </span>
            )}

            {/* 创建时间 */}
            <span className="ml-auto text-[11px] text-slate-400">
              创建于 {formatCreatedAt(todo.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
