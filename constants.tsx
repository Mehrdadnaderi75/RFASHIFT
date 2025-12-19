
import { User, UserRole, ShiftType } from './types';

export const STORAGE_KEY = 'RFA_SHIFT_MASTER_V2';

export const INITIAL_SUPER_ADMIN: User = {
  personnelId: '123456789',
  name: 'مدیریت ارشد آریا',
  password: '123456789',
  role: UserRole.SUPER_ADMIN,
  createdAt: Date.now()
};

export const SHIFT_LABELS: Record<ShiftType, string> = {
  [ShiftType.DAY]: 'شیفت روز (آفتاب)',
  [ShiftType.NIGHT]: 'شیفت شب (مهتاب)',
  [ShiftType.REST]: 'استراحت / مرخصی'
};

export const SHIFT_COLORS: Record<ShiftType, string> = {
  [ShiftType.DAY]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  [ShiftType.NIGHT]: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  [ShiftType.REST]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
};

export const SHIFT_ICONS: Record<ShiftType, string> = {
  [ShiftType.DAY]: '☀️',
  [ShiftType.NIGHT]: '🌙',
  [ShiftType.REST]: '🛌'
};
