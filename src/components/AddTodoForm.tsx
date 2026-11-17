import { useState, type FormEvent } from 'react';
import { AlertCircle, PlusCircle } from 'lucide-react';
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '../constants/todo';
import { useTodoStore } from '../store/useTodoStore';
import type { TodoCategory, TodoPriority } from '../types/todo';

/**
 * 添加待办事项表单组件
 * 支持标题（必填校验）、描述、分类、优先级、截止日期录入
 */
export default function AddTodoForm() {
  const addTodo = useTodoStore((state) => state.addTodo);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TodoCategory>('work');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('请输入待办事项标题，标题不能为空');
      return;
    }

    addTodo({
      title: trimmedTitle,
      description: description.trim(),
      category,
      priority,
      dueDate: dueDate ? dueDate : null,
    });

    // 重置表单状态
    setTitle('');
    setDescription('');
    setCategory('work');
    setPriority('medium');
    setDueDate('');
    setError('');
  };

  return (
    <section
      aria-label="添加新待办事项"
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-5"
    >
      <h2 className="mb-3.5 flex items-center gap-2 text-base font-semibold text-slate-800">
        <PlusCircle className="h-5 w-5 text-indigo-600" aria-hidden="true" />
        <span>添加待办事项</span>
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {/* 标题输入 */}
        <div>
          <label
            htmlFor="todo-title"
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            任务标题 <span className="text-rose-500">*</span>
          </label>
          <input
            id="todo-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="例如：完成项目需求评审、背诵 50 个英语单词..."
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'todo-title-error' : undefined}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition outline-none ${
              error
                ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
            }`}
          />
          {error && (
            <p
              id="todo-title-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* 描述输入 */}
        <div>
          <label
            htmlFor="todo-description"
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            任务描述（可选）
          </label>
          <textarea
            id="todo-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="补充任务细节、步骤或备注信息..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 transition outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* 分类、优先级、截止日期与提交按钮 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
          <div>
            <label
              htmlFor="todo-category"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              分类
            </label>
            <select
              id="todo-category"
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
              htmlFor="todo-priority"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              优先级
            </label>
            <select
              id="todo-priority"
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
              htmlFor="todo-due-date"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              截止日期（可选）
            </label>
            <input
              id="todo-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 transition outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-2xs transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-indigo-800"
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            <span>添加任务</span>
          </button>
        </div>
      </form>
    </section>
  );
}
