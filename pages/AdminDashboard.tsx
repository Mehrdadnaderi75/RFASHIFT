
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { User, AppData, UserRole, ShiftType, ShiftRecord, Message, ActivityLog, LogType, LogStatus } from '../types';
import { SHIFT_LABELS, SHIFT_COLORS, SHIFT_ICONS } from '../constants';
// Fix: Corrected import path from ../utils/dateUtils to ../dateUtils
import { getPersianDate } from '../dateUtils';

interface Props {
  currentUser: User;
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ currentUser, data, updateData, onLogout }) => {
  const [tab, setTab] = useState<'users' | 'shifts' | 'messages' | 'activity'>('shifts');
  const [newUser, setNewUser] = useState({ personnelId: '', name: '', password: '' });
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(getPersianDate());
  
  const [pattern, setPattern] = useState({ 
    day: 4, 
    night: 4, 
    rest: 4,
    order: [ShiftType.DAY, ShiftType.NIGHT, ShiftType.REST] 
  });
  const [patternStartDate, setPatternStartDate] = useState(getPersianDate());
  const [patternDuration, setPatternDuration] = useState(30);

  const [msgText, setMsgText] = useState('');
  const [msgImg, setMsgImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [logType, setLogType] = useState<LogType>(LogType.FAULT);
  const [logCount, setLogCount] = useState<number>(0);
  const [logReason, setLogReason] = useState<string>('');
  const [logImg, setLogImg] = useState<string | null>(null);
  const logFileInputRef = useRef<HTMLInputElement>(null);

  const relevantMessages = useMemo(() => 
    (data?.messages || []).filter(m => m.fromId === currentUser.personnelId || m.toId === currentUser.personnelId || m.toId === 'ALL'), 
    [data?.messages, currentUser.personnelId]
  );
  
  const unreadCount = useMemo(() => 
    relevantMessages.filter(m => m.toId === currentUser.personnelId && !m.readBy?.includes(currentUser.personnelId)).length,
    [relevantMessages, currentUser.personnelId]
  );

  const handleAddUser = () => {
    if (!newUser.personnelId || !newUser.name) return alert('اطلاعات ناقص است.');
    updateData({ users: [...(data?.users || []), { ...newUser, role: UserRole.USER, createdAt: Date.now() }] });
    setNewUser({ personnelId: '', name: '', password: '' });
    alert('کاربر ثبت شد.');
  };

  const handleSetShift = (type: ShiftType) => {
    if (!selectedUser) return alert('کاربر را انتخاب کنید.');
    const newShifts = [...(data?.shifts || [])];
    const idx = newShifts.findIndex(s => s.personnelId === selectedUser && s.date === selectedDate);
    if (idx > -1) newShifts[idx].type = type;
    else newShifts.push({ personnelId: selectedUser, date: selectedDate, type });
    updateData({ shifts: newShifts });
    alert('تغییرات ثبت شد.');
  };

  const handleSendMessage = (isPublic: boolean) => {
    if (!msgText && !msgImg) return;
    updateData({ messages: [...(data?.messages || []), {
      id: Date.now().toString(),
      fromId: currentUser.personnelId,
      toId: isPublic ? 'ALL' : selectedUser,
      text: msgText,
      imageUrl: msgImg || undefined,
      timestamp: Date.now(),
      readBy: []
    }] });
    setMsgText('');
    setMsgImg(null);
  };

  const handleAddActivity = () => {
    if (!selectedUser) return alert('نیرو را انتخاب کنید.');
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      personnelId: selectedUser,
      adminId: currentUser.personnelId,
      date: selectedDate,
      count: logCount,
      reason: logReason,
      type: logType,
      status: LogStatus.PENDING,
      imageUrl: logImg || undefined
    };
    updateData({ activityLogs: [...(data?.activityLogs || []), newLog] });
    setLogCount(0);
    setLogReason('');
    setLogImg(null);
    alert('گزارش جهت تایید مدیر کل ارسال شد.');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-5 shadow-lg flex justify-between items-center rounded-b-3xl">
        <h2 className="font-bold">پنل مدیریت RFA</h2>
        <button onClick={onLogout} className="bg-white/20 px-3 py-1 rounded-xl text-xs">خروج</button>
      </div>

      <div className="flex p-2 bg-white m-4 rounded-2xl shadow-sm border border-slate-100 gap-1">
        <button onClick={() => setTab('shifts')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold ${tab === 'shifts' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>شیفت‌ها</button>
        <button onClick={() => setTab('users')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold ${tab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>ثبت نیرو</button>
        <button onClick={() => setTab('messages')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold relative ${tab === 'messages' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>
          پیام‌ها {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>}
        </button>
        <button onClick={() => setTab('activity')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold ${tab === 'activity' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>گزارشات</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-4">
        {tab === 'shifts' && (
          <div className="bg-white p-5 rounded-3xl border space-y-4">
            <h3 className="font-bold text-sm">🗓️ برنامه دستی</h3>
            <select className="w-full p-3 bg-slate-50 border rounded-xl text-xs" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
              <option value="">انتخاب نیرو...</option>
              {data.users?.filter(u => u.role === UserRole.USER).map(u => <option key={u.personnelId} value={u.personnelId}>{u.name}</option>)}
            </select>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(SHIFT_LABELS).map(([key, label]) => (
                <button key={key} onClick={() => handleSetShift(key as ShiftType)} className={`p-3 rounded-xl text-[9px] font-bold border ${SHIFT_COLORS[key as ShiftType]}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div className="bg-white p-6 rounded-3xl border space-y-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button onClick={() => setLogType(LogType.FAULT)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${logType === LogType.FAULT ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500'}`}>خطا</button>
               <button onClick={() => setLogType(LogType.REWARD)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${logType === LogType.REWARD ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}>تشویق</button>
            </div>
            <select className="w-full p-3 bg-slate-50 border rounded-xl text-xs" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
              <option value="">انتخاب نیرو...</option>
              {data.users?.filter(u => u.role === UserRole.USER).map(u => <option key={u.personnelId} value={u.personnelId}>{u.name}</option>)}
            </select>
            <textarea className="w-full p-3 bg-slate-50 border rounded-xl text-xs" rows={3} placeholder="علت..." value={logReason} onChange={e => setLogReason(e.target.value)} />
            <button onClick={() => logFileInputRef.current?.click()} className="w-full bg-slate-50 border-dashed border py-3 rounded-xl text-[10px] text-slate-400">
               {logImg ? '📸 مستند انتخاب شد' : '📷 پیوست مستندات'}
            </button>
            <input type="file" hidden ref={logFileInputRef} accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0];
              if(f) { const r = new FileReader(); r.onloadend = () => setLogImg(r.result as string); r.readAsDataURL(f); }
            }} />
            <button onClick={handleAddActivity} className={`w-full text-white py-4 rounded-xl font-bold text-xs ${logType === LogType.FAULT ? 'bg-red-600' : 'bg-emerald-600'}`}>ارسال برای تایید</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
