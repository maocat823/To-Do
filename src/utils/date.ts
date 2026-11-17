import {
  format,
  isBefore,
  isToday,
  isValid,
  parseISO,
  startOfDay,
} from 'date-fns';
import type { DueDateStatus } from '../types/todo';

/**
 * 安全解析日期字符串为 Date 对象，无效时返回 null
 */
function parseSafeDate(dateStr: string | null): Date | null {
  if (!dateStr || !dateStr.trim()) {
    return null;
  }

  const parsed = parseISO(dateStr);
  return isValid(parsed) ? parsed : null;
}

/**
 * 格式化截止日期为可读中文格式（如 "2026年11月20日"）
 */
export function formatDueDate(dueDate: string | null): string {
  const parsed = parseSafeDate(dueDate);
  if (!parsed) {
    return '';
  }

  return format(parsed, 'yyyy年MM月dd日');
}

/**
 * 格式化创建时间为简短可读中文格式（如 "2026-11-17 22:30"）
 */
export function formatCreatedAt(createdAt: string): string {
  const parsed = parseSafeDate(createdAt);
  if (!parsed) {
    return '';
  }

  return format(parsed, 'yyyy-MM-dd HH:mm');
}

/**
 * 判断待办事项是否已逾期（未完成且截止日期早于今天零点）
 */
export function isTodoOverdue(
  dueDate: string | null,
  completed = false
): boolean {
  if (completed) {
    return false;
  }

  const parsed = parseSafeDate(dueDate);
  if (!parsed) {
    return false;
  }

  return isBefore(startOfDay(parsed), startOfDay(new Date()));
}

/**
 * 计算待办事项的截止日期状态
 * - 'none': 无截止日期或任务已完成
 * - 'overdue': 未完成且已逾期
 * - 'today': 未完成且今日到期
 * - 'upcoming': 未完成且未来到期
 */
export function getDueDateStatus(
  dueDate: string | null,
  completed: boolean
): DueDateStatus {
  const parsed = parseSafeDate(dueDate);
  if (!parsed || completed) {
    return 'none';
  }

  if (isBefore(startOfDay(parsed), startOfDay(new Date()))) {
    return 'overdue';
  }

  if (isToday(parsed)) {
    return 'today';
  }

  return 'upcoming';
}

/**
 * 获取截止日期状态对应的中文提示文案
 */
export function getDueDateLabel(
  dueDate: string | null,
  completed: boolean
): string {
  const formatted = formatDueDate(dueDate);
  if (!formatted) {
    return '';
  }

  const status = getDueDateStatus(dueDate, completed);
  switch (status) {
    case 'overdue':
      return `已逾期 · ${formatted}`;
    case 'today':
      return `今日到期 · ${formatted}`;
    case 'upcoming':
    case 'none':
      return `截止 ${formatted}`;
  }
}
