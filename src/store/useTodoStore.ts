import { create } from 'zustand';
import { DEFAULT_FILTERS } from '../constants/todo';
import type {
  Todo,
  TodoCategory,
  TodoFilters,
  TodoFormInput,
  TodoPriority,
  TodoStatusFilter,
} from '../types/todo';
import { generateTodoId, loadTodos, saveTodos } from '../utils/storage';

/**
 * Zustand 全局待办事项状态与操作接口
 */
export interface TodoStoreState {
  /** 全量待办事项列表 */
  todos: Todo[];
  /** 当前筛选与搜索条件 */
  filters: TodoFilters;

  /** 添加新待办事项（自动生成 id 与创建时间，插入列表顶部并持久化） */
  addTodo: (input: TodoFormInput) => void;
  /** 根据 id 更新待办事项字段并持久化 */
  updateTodo: (id: string, updates: Partial<TodoFormInput>) => void;
  /** 根据 id 删除单条待办事项并持久化 */
  deleteTodo: (id: string) => void;
  /** 切换指定待办事项的完成状态并持久化 */
  toggleTodo: (id: string) => void;
  /** 批量清除所有已完成的待办事项并持久化 */
  clearCompleted: () => void;

  /** 设置搜索关键词 */
  setSearchQuery: (query: string) => void;
  /** 设置分类筛选条件 */
  setCategoryFilter: (category: TodoCategory | 'all') => void;
  /** 设置优先级筛选条件 */
  setPriorityFilter: (priority: TodoPriority | 'all') => void;
  /** 设置完成状态筛选条件 */
  setStatusFilter: (status: TodoStatusFilter) => void;
  /** 一键重置所有筛选与搜索条件 */
  resetFilters: () => void;
}

/**
 * 待办事项全局状态管理 Store
 */
export const useTodoStore = create<TodoStoreState>((set) => ({
  todos: loadTodos(),
  filters: { ...DEFAULT_FILTERS },

  addTodo: (input) => {
    const trimmedTitle = input.title.trim();
    if (!trimmedTitle) {
      return;
    }

    const newTodo: Todo = {
      id: generateTodoId(),
      title: trimmedTitle,
      description: input.description.trim(),
      category: input.category,
      priority: input.priority,
      dueDate: input.dueDate && input.dueDate.trim() ? input.dueDate : null,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const nextTodos = [newTodo, ...state.todos];
      saveTodos(nextTodos);
      return { todos: nextTodos };
    });
  },

  updateTodo: (id, updates) => {
    set((state) => {
      const nextTodos = state.todos.map((todo) => {
        if (todo.id !== id) {
          return todo;
        }

        const nextTitle =
          updates.title !== undefined ? updates.title.trim() : todo.title;
        if (!nextTitle) {
          return todo;
        }

        const nextDescription =
          updates.description !== undefined
            ? updates.description.trim()
            : todo.description;

        const nextDueDate =
          updates.dueDate !== undefined
            ? updates.dueDate && updates.dueDate.trim()
              ? updates.dueDate
              : null
            : todo.dueDate;

        return {
          ...todo,
          ...updates,
          title: nextTitle,
          description: nextDescription,
          dueDate: nextDueDate,
        };
      });

      saveTodos(nextTodos);
      return { todos: nextTodos };
    });
  },

  deleteTodo: (id) => {
    set((state) => {
      const nextTodos = state.todos.filter((todo) => todo.id !== id);
      saveTodos(nextTodos);
      return { todos: nextTodos };
    });
  },

  toggleTodo: (id) => {
    set((state) => {
      const nextTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodos(nextTodos);
      return { todos: nextTodos };
    });
  },

  clearCompleted: () => {
    set((state) => {
      const nextTodos = state.todos.filter((todo) => !todo.completed);
      saveTodos(nextTodos);
      return { todos: nextTodos };
    });
  },

  setSearchQuery: (searchQuery) => {
    set((state) => ({
      filters: {
        ...state.filters,
        searchQuery,
      },
    }));
  },

  setCategoryFilter: (category) => {
    set((state) => ({
      filters: {
        ...state.filters,
        category,
      },
    }));
  },

  setPriorityFilter: (priority) => {
    set((state) => ({
      filters: {
        ...state.filters,
        priority,
      },
    }));
  },

  setStatusFilter: (status) => {
    set((state) => ({
      filters: {
        ...state.filters,
        status,
      },
    }));
  },

  resetFilters: () => {
    set({
      filters: { ...DEFAULT_FILTERS },
    });
  },
}));
