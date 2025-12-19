
import { User, UserRole, ShiftType } from './types';

export const STORAGE_KEY = 'SHIFT_RFA_STABLE_V1';

export const INITIAL_SUPER_ADMIN: User = {
  personnelId: '123456789',
  name: 'مدیر کل سیستم',
  password: '123456789',
  role: UserRole.SUPER_ADMIN,
  createdAt: Date.now()
};

export const SHIFT_LABELS: Record<ShiftType, string> = {
  [ShiftType.DAY]: 'شیفت روز (۰۷:۰۰)',
  [ShiftType.NIGHT]: 'شیفت شب (۱۹:۰۰)',
  [ShiftType.REST]: 'استراحت / OFF'
};

export const SHIFT_COLORS: Record<ShiftType, string> = {
  [ShiftType.DAY]: 'bg-amber-50 text-amber-700 border-amber-200',
  [ShiftType.NIGHT]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [ShiftType.REST]: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

// Fix: Added missing SHIFT_ICONS mapping
export const SHIFT_ICONS: Record<ShiftType, string> = {
  [ShiftType.DAY]: '☀️',
  [ShiftType.NIGHT]: '🌙',
  [ShiftType.REST]: '🏠'
};
