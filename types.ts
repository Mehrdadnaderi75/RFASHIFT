
export enum ShiftType {
  DAY = 'DAY',
  NIGHT = 'NIGHT',
  REST = 'REST'
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum LogType {
  FAULT = 'FAULT',
  REWARD = 'REWARD'
}

export enum LogStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  personnelId: string;
  name: string;
  password: string;
  role: UserRole;
  createdAt?: number;
}

export interface ShiftRecord {
  personnelId: string;
  date: string;
  type: ShiftType;
}

export interface ActivityLog {
  id: string;
  personnelId: string;
  adminId: string;
  date: string;
  count: number;
  reason: string;
  type: LogType;
  status: LogStatus;
  imageUrl?: string;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  imageUrl?: string;
  timestamp: number;
  readBy: string[];
}

export interface AppData {
  users: User[];
  shifts: ShiftRecord[];
  messages: Message[];
  activityLogs: ActivityLog[];
}
