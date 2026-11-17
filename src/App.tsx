import { useState } from 'react';
import AddTodoForm from './components/AddTodoForm';
import EditTodoModal from './components/EditTodoModal';
import FilterBar from './components/FilterBar';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import TodoList from './components/TodoList';
import type { Todo } from './types/todo';

/**
 * 待办事项管理应用主视图组件
 * 组装顶部栏、统计看板、添加表单、多条件筛选栏、任务列表及编辑弹窗
 */
export default function App() {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Header />

        <main>
          <StatsPanel />
          <AddTodoForm />
          <FilterBar />
          <TodoList onEditTodo={(todo) => setEditingTodo(todo)} />
        </main>

        <EditTodoModal
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
        />
      </div>
    </div>
  );
}
