
import React, { useState, useMemo } from 'react';
import { User, AppData, ShiftType, LogStatus } from '../types';
import { SHIFT_LABELS, SHIFT_COLORS, SHIFT_ICONS, INITIAL_SUPER_ADMIN } from '../constants';
import { getCurrentPersianYearMonth, getDaysInMonth, PERSIAN_MONTH_NAMES } from '../dateUtils';

interface Props {
  currentUser: User;
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  onLogout: () => void;
}

const UserDashboard: React.FC<Props> = ({ currentUser, data, updateData, onLogout }) => {
  const { year: curY, month: curM } = getCurrentPersianYearMonth();
  const [viewMonth, setViewMonth] = useState(curM);
  const [activeTab, setActiveTab] = useState<'calendar' | 'logs'>('calendar');

  const daysInMonth = getDaysInMonth(curY, viewMonth);
  const userShifts = data.shifts.filter(s => s.personnelId === currentUser.personnelId);
  const userLogs = useMemo(() => 
    data.activityLogs.filter(l => l.personnelId === currentUser.personnelId && l.status === LogStatus.APPROVED), 
    [data.activityLogs, currentUser.personnelId]
  );

  return (
    <div className="flex flex-col h-full bg-[#000814] text-white">
      {/* Sleek Header */}
      <div className="p-6 pt-12 glass rounded-b-[2.5rem] flex justify-between items-center shadow-2xl">
        <div>
          <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-1">Authenticated</p>
          <h2 className="text-xl font-black">{currentUser.name}</h2>
        </div>
        <button onClick={onLogout} className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">✕</button>
      </div>

      {/* Tabs */}
      <div className="flex px-6 mt-6 gap-2">
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'calendar' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-white/40'}`}
        >
          برنامه شیفت
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'logs' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-white/40'}`}
        >
          امتیازات و سوابق
        </button>
      </div>

      {/* Main View */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar pb-32">
        {activeTab === 'calendar' && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex items-center justify-between glass p-4 rounded-2xl">
              <button onClick={() => setViewMonth(m => m === 1 ? 12 : m - 1)} className="text-yellow-500">◀</button>
              <span className="font-bold text-sm tracking-widest">{PERSIAN_MONTH_NAMES[viewMonth-1]}</span>
              <button onClick={() => setViewMonth(m => m === 12 ? 1 : m + 1)} className="text-yellow-500">▶</button>
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${curY}-${viewMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const shift = userShifts.find(s => s.date === dateStr);
                
                return (
                  <div key={day} className={`flex items-center gap-4 glass p-4 rounded-2xl border-r-4 ${shift ? SHIFT_COLORS[shift.type].replace('bg-','border-') : 'border-white/5'}`}>
                    <div className="w-10 h-10 glass rounded-xl flex items-center justify-center font-bold text-sm">
                      {day}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-white/40 font-bold mb-1">{dateStr}</p>
                      <p className={`text-xs font-bold ${shift ? '' : 'text-white/20 italic'}`}>
                        {shift ? SHIFT_LABELS[shift.type] : 'بدون برنامه'}
                      </p>
                    </div>
                    <div className="text-xl">{shift ? SHIFT_ICONS[shift.type] : '⚪'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4 animate-fade-up">
            {userLogs.map(log => (
              <div key={log.id} className="glass p-5 rounded-2xl border-l-4 border-emerald-500">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{log.type}</span>
                  <span className="text-[10px] text-white/20 font-bold">{log.date}</span>
                </div>
                <p className="text-sm font-bold leading-relaxed">{log.reason}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <span className="text-lg font-black text-yellow-500">+{log.count}</span>
                </div>
              </div>
            ))}
            {userLogs.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center opacity-20">
                <span className="text-5xl mb-4">📜</span>
                <p className="text-xs font-bold uppercase tracking-[0.3em]">No Records Yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Persistent Bottom Info */}
      <div className="fixed bottom-0 left-0 w-full glass border-t border-white/5 p-6 safe-bottom">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Network Stable</span>
          </div>
          <p className="text-[9px] text-white/20 font-bold">V 2.1.0 STABLE</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
