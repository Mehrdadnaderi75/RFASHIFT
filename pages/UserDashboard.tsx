
import React, { useState, useMemo } from 'react';
import { User, AppData, ShiftType, LogType, LogStatus } from '../types';
import { SHIFT_LABELS, SHIFT_COLORS, SHIFT_ICONS, INITIAL_SUPER_ADMIN } from '../constants';
import { getCurrentPersianYearMonth, getDaysInMonth, PERSIAN_MONTH_NAMES, getHoliday } from '../dateUtils';

interface Props {
  currentUser: User;
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  onLogout: () => void;
}

const UserDashboard: React.FC<Props> = ({ currentUser, data, updateData, onLogout }) => {
  const { year: curY, month: curM } = getCurrentPersianYearMonth();
  const [viewYear, setViewYear] = useState(curY);
  const [viewMonth, setViewMonth] = useState(curM);
  const [activeTab, setActiveTab] = useState<'calendar' | 'messages' | 'activity'>('calendar');
  const [msgText, setMsgText] = useState('');

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const userShifts = data.shifts.filter(s => s.personnelId === currentUser.personnelId);
  const relevantMessages = useMemo(() => 
    data.messages.filter(m => m.fromId === currentUser.personnelId || m.toId === currentUser.personnelId || m.toId === 'ALL'),
    [data.messages, currentUser.personnelId]
  );
  const approvedActivity = useMemo(() => data.activityLogs.filter(l => l.personnelId === currentUser.personnelId && l.status === LogStatus.APPROVED), [data.activityLogs, currentUser.personnelId]);
  
  const unreadCount = useMemo(() => 
    relevantMessages.filter(m => m.toId === currentUser.personnelId && !m.readBy?.includes(currentUser.personnelId)).length,
    [relevantMessages, currentUser.personnelId]
  );

  const handleSendMessage = () => {
    if (!msgText.trim()) return;
    const adminToId = data.users.find(u => u.role === 'ADMIN')?.personnelId || INITIAL_SUPER_ADMIN.personnelId;
    updateData({ 
      messages: [...data.messages, {
        id: Date.now().toString(),
        fromId: currentUser.personnelId,
        toId: adminToId,
        text: msgText,
        timestamp: Date.now(),
        readBy: []
      }]
    });
    setMsgText('');
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] overflow-hidden">
      {/* Dynamic Header */}
      <div className="bg-[#001529] pt-12 pb-14 px-6 rounded-b-[3rem] shadow-2xl relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white font-black text-xl">{currentUser.name}</h2>
            <p className="text-blue-300 text-[10px] tracking-widest uppercase">ID: {currentUser.personnelId} • ONLINE</p>
          </div>
          <button onClick={onLogout} className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white text-lg">⚙</button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 -mt-8 pb-32 no-scrollbar">
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex justify-between items-center">
              <button onClick={() => setViewMonth(m => m === 1 ? 12 : m - 1)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">◀</button>
              <div className="text-center">
                <span className="block font-black text-lg text-slate-800">{PERSIAN_MONTH_NAMES[viewMonth-1]}</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest">{viewYear}</span>
              </div>
              <button onClick={() => setViewMonth(m => m === 12 ? 1 : m + 1)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">▶</button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${viewYear}-${viewMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const shift = userShifts.find(s => s.date === dateStr);
                const holiday = getHoliday(viewMonth, day);
                return (
                  <div key={day} className={`group p-4 rounded-3xl border flex items-center justify-between transition-all duration-300 ${shift ? SHIFT_COLORS[shift.type] : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center shadow-inner border border-slate-100">
                        <span className="text-sm font-black text-slate-800 leading-none">{day}</span>
                        <span className="text-[7px] text-slate-400 uppercase font-bold">Day</span>
                      </div>
                      <div>
                        <p className={`font-bold text-xs ${holiday ? 'text-red-500' : 'text-slate-800'}`}>
                          {holiday || (shift ? SHIFT_LABELS[shift.type] : 'بدون برنامه')}
                        </p>
                        <p className="text-[9px] opacity-40 font-bold uppercase">{dateStr}</p>
                      </div>
                    </div>
                    <div className="text-2xl filter grayscale-[0.2] group-hover:scale-110 transition-transform">
                      {shift ? SHIFT_ICONS[shift.type] : '⚪'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-4">
              <h3 className="font-black text-slate-800 text-sm">پیام به مدیریت واحد</h3>
              <textarea 
                className="w-full p-5 bg-slate-50 rounded-[1.5rem] text-xs border-none outline-none focus:ring-2 focus:ring-blue-100 transition-all no-scrollbar" 
                rows={3} 
                placeholder="گزارش یا درخواست خود را بنویسید..." 
                value={msgText} 
                onChange={e => setMsgText(e.target.value)} 
              />
              <button onClick={handleSendMessage} className="w-full bg-[#001529] text-white py-4 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all">ارسال گزارش</button>
            </div>
            <div className="space-y-4">
              {relevantMessages.slice().reverse().map(m => (
                <div key={m.id} className={`p-5 rounded-[2rem] border relative overflow-hidden ${m.fromId === currentUser.personnelId ? 'bg-indigo-50 border-indigo-100 mr-12' : 'bg-white border-slate-100 ml-12 shadow-sm'}`}>
                  <p className="text-xs text-slate-700 leading-relaxed">{m.text}</p>
                  <div className="mt-2 flex justify-between items-center opacity-40 text-[8px] font-bold">
                    <span>{new Date(m.timestamp).toLocaleTimeString('fa-IR')}</span>
                    <span>{m.fromId === 'ALL' ? 'عمومی' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center gap-3 px-2">
              <span className="w-8 h-8 bg-yellow-500 rounded-xl flex items-center justify-center text-white">🏆</span>
              <h3 className="font-black text-slate-800 text-sm uppercase">Performance Records</h3>
            </div>
            {approvedActivity.map(log => (
              <div key={log.id} className={`p-6 rounded-[2.5rem] border shadow-sm transition-all ${log.type === LogType.FAULT ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${log.type === LogType.FAULT ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {log.type === LogType.FAULT ? 'Fault' : 'Reward'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{log.date}</span>
                </div>
                <p className="text-[11px] font-black text-slate-800 mb-1">Score: {log.count}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{log.reason}</p>
              </div>
            ))}
            {approvedActivity.length === 0 && (
              <div className="py-20 text-center space-y-4 opacity-30">
                <div className="text-5xl">📁</div>
                <p className="text-xs font-bold uppercase tracking-widest">No activity data found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex justify-around items-center py-4 pb-10 px-6 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] z-50">
        <button onClick={() => setActiveTab('calendar')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'calendar' ? 'scale-110 text-blue-600' : 'text-slate-400 opacity-60'}`}>
          <span className="text-2xl">🗓️</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Calendar</span>
        </button>
        <button onClick={() => setActiveTab('messages')} className={`flex flex-col items-center gap-1 relative transition-all duration-300 ${activeTab === 'messages' ? 'scale-110 text-blue-600' : 'text-slate-400 opacity-60'}`}>
          <span className="text-2xl">💬</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Messages</span>
          {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white animate-bounce">{unreadCount}</span>}
        </button>
        <button onClick={() => setActiveTab('activity')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'activity' ? 'scale-110 text-blue-600' : 'text-slate-400 opacity-60'}`}>
          <span className="text-2xl">🏆</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Score</span>
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
