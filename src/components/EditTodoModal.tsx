import { useEffect, useState, type FormEvent } from 'react';
import { AlertCircle, Save, X } from 'lucide-react';
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '../constants/todo';
import { useTodoStore } from '../store/useTodoStore';
import type { Todo, TodoCategory, TodoPriority } from '../types/todo';

interface EditTodoModalProps {
  /** 当前正在编辑的待办事项（为 null 时不显示弹窗） */
  todo: Todo | null;
  /** 关闭弹窗回调 */
  onClose: () => void;
}

/**
 * 编辑待办事项弹窗组件
 * 支持修改标题（必填校验）、描述、分类、优先级、截止日期，支持 Esc 键关闭
 */
export default function EditTodoModal({ todo, onClose }: EditTodoModalProps) {
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TodoCategory>('work');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // 当打开弹窗或切换编辑对象时，预填表单数据
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setCategory(todo.category);
      setPriority(todo.priority);
      setDueDate(todo.dueDate ?? '');
      setError('');
    }
  }, [todo]);

  // 支持按下 Esc 关闭弹窗
  useEffect(() => {
    if (!todo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [todo, onClose]);

  if (!todo) {
    return null;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('请输入待办事项标题，标题不能为空');
      return;
    }

    updateTodo(todo.id, {
      title: trimmedTitle,
      description: description.trim(),
      category,
      priority,
      dueDate: dueDate ? dueDate : null,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-todo-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2
            id="edit-todo-modal-title"
            className="text-base font-bold text-slate-900 sm:text-lg"
          >
            编辑待办事项
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭编辑弹窗"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* 编辑表单 */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="edit-todo-title"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              任务标题 <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-todo-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="请输入待办事项标题"
              aria-invalid={Boolean(error)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 transition outline-none ${
                error
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
            {error && (
              <p
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
              >
                <AlertCircle
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-todo-description"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              任务描述（可选）
            </label>
            <textarea
              id="edit-todo-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="补充任务详情或备注信息..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 transition outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label
                htmlFor="edit-todo-category"
                className="mb-1 block text-xs font-medium text-slate-700"
              >
                分类
              </label>
              <select
                id="edit-todo-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TodoCategory)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 transition outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-todo-priority"
                className="mb-1 block text-xs font-medium text-slate-700"
              >
                优先级
              </label>
              <select
                id="edit-todo-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TodoPriority)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 transition outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-todo-due-date"
                className="mb-1 block text-xs font-medium text-slate-700"
              >
                截止日期（可选）
              </label>
              <input
                id="edit-todo-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 transition outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:ring-2 focus:ring-slate-300 focus:outline-none sm:text-sm"
            >
              取消
            </button>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:text-sm"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              <span>保存修改</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
