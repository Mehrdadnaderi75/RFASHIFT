
import React, { useState, useRef, useMemo } from 'react';
import { User, AppData, UserRole, LogStatus, LogType } from '../types';
import { SHIFT_LABELS, SHIFT_COLORS } from '../constants';
import { getPersianDate } from '../dateUtils';

interface Props {
  currentUser: User;
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  onLogout: () => void;
}

const SuperAdminDashboard: React.FC<Props> = ({ currentUser, data, updateData, onLogout }) => {
  const [tab, setTab] = useState<'approvals' | 'admins' | 'messaging' | 'overview'>('approvals');
  const [newAdmin, setNewAdmin] = useState({ personnelId: '', name: '', password: '' });
  const [msgText, setMsgText] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState(getPersianDate());

  const users = data?.users || [];
  const admins = useMemo(() => users.filter(u => u.role === UserRole.ADMIN), [users]);
  const pendingLogs = useMemo(() => (data?.activityLogs || []).filter(l => l.status === LogStatus.PENDING), [data?.activityLogs]);

  const handleApproveLog = (id: string, status: LogStatus) => {
    const updatedLogs = data.activityLogs.map(l => l.id === id ? { ...l, status } : l);
    updateData({ activityLogs: updatedLogs });
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.personnelId) return alert('اطلاعات ناقص');
    updateData({ 
      users: [...users, { ...newAdmin, role: UserRole.ADMIN, createdAt: Date.now() }] 
    });
    setNewAdmin({ personnelId: '', name: '', password: '' });
    alert('مدیر جدید اضافه شد.');
  };

  const handleSendMessage = () => {
    if (!msgText) return;
    updateData({ 
      messages: [...data.messages, {
        id: Date.now().toString(),
        fromId: currentUser.personnelId,
        toId: selectedRecipient,
        text: msgText,
        timestamp: Date.now(),
        readBy: []
      }]
    });
    setMsgText('');
    alert('پیام ارسال شد.');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-[#1a237e] text-white p-6 pb-10 rounded-b-[2.5rem] shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-black text-xl">مدیریت عالی RFA</h2>
          <button onClick={onLogout} className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold">خروج</button>
        </div>
        <p className="text-indigo-200 text-[10px] uppercase font-bold tracking-widest">Root Control Panel</p>
      </div>

      <div className="flex bg-[#283593] text-white/50 m-4 -mt-6 rounded-2xl p-1 gap-1 shadow-xl">
        {[
          { id: 'approvals', label: 'تاییدات' },
          { id: 'admins', label: 'مدیران' },
          { id: 'messaging', label: 'اعلان‌ها' },
          { id: 'overview', label: 'مانیتورینگ' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setTab(t.id as any)} 
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${tab === t.id ? 'bg-white text-indigo-900 shadow-md' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {tab === 'approvals' && (
          <div className="space-y-4">
            {pendingLogs.map(log => (
              <div key={log.id} className="bg-white p-5 rounded-3xl border shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-black text-xs text-indigo-900">{users.find(u => u.personnelId === log.personnelId)?.name || 'نیرو'}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{log.date}</span>
                </div>
                <div className={`p-4 rounded-2xl text-xs ${log.type === LogType.FAULT ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  <p className="font-black mb-1">{log.type === LogType.FAULT ? '🚩 خطا' : '🌟 تشویق'}</p>
                  <p className="opacity-80">{log.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApproveLog(log.id, LogStatus.APPROVED)} className="flex-1 bg-emerald-600 text-white py-3 rounded-2xl text-[10px] font-bold shadow-lg">تایید نهایی</button>
                  <button onClick={() => handleApproveLog(log.id, LogStatus.REJECTED)} className="flex-1 bg-red-600 text-white py-3 rounded-2xl text-[10px] font-bold shadow-lg">رد گزارش</button>
                </div>
              </div>
            ))}
            {pendingLogs.length === 0 && <div className="text-center py-20 text-slate-300 text-xs italic">موردی برای تایید وجود ندارد</div>}
          </div>
        )}

        {tab === 'admins' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-3">
              <h3 className="font-black text-indigo-900 text-sm mb-2">ثبت مدیر واحد جدید</h3>
              <input className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs" placeholder="نام مدیر" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} />
              <input className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs" placeholder="کد پرسنلی" value={newAdmin.personnelId} onChange={e => setNewAdmin({...newAdmin, personnelId: e.target.value})} />
              <input type="password" title="password" className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs" placeholder="رمز عبور" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
              <button onClick={handleAddAdmin} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">ایجاد حساب مدیریتی</button>
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 px-2 uppercase tracking-widest">Active Managers</h4>
              {admins.map(u => (
                <div key={u.personnelId} className="bg-white p-4 rounded-2xl border flex justify-between items-center">
                  <span className="font-bold text-xs">{u.name}</span>
                  <span className="text-[9px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">Manager</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'messaging' && (
          <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
            <select className="w-full p-4 bg-indigo-50 rounded-2xl text-xs font-bold border-none" value={selectedRecipient} onChange={e => setSelectedRecipient(e.target.value)}>
              <option value="ALL">📢 ارسال به کل پرسنل (Public)</option>
              {users.map(u => <option key={u.personnelId} value={u.personnelId}>{u.name} ({u.role})</option>)}
            </select>
            <textarea className="w-full p-4 bg-indigo-50 rounded-2xl text-xs border-none" rows={5} placeholder="متن اطلاعیه..." value={msgText} onChange={e => setMsgText(e.target.value)} />
            <button onClick={handleSendMessage} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs shadow-lg">انتشار سراسری</button>
          </div>
        )}

        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-3">
              <span className="text-xs font-black text-indigo-900">تاریخ مانیتورینگ:</span>
              <input type="text" className="flex-1 p-2 bg-indigo-50 rounded-xl text-xs text-center font-bold" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            </div>
            {users.filter(u => u.role === UserRole.USER).map(u => {
              const shift = (data?.shifts || []).find(s => s.personnelId === u.personnelId && s.date === selectedDate);
              return (
                <div key={u.personnelId} className="bg-white p-4 rounded-2xl border flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-bold text-xs">{u.name}</span>
                    <span className="text-[8px] text-slate-400">ID: {u.personnelId}</span>
                  </div>
                  <span className={`text-[9px] px-3 py-1 rounded-full font-bold ${shift ? SHIFT_COLORS[shift.type] : 'bg-slate-50 text-slate-400'}`}>
                    {shift ? SHIFT_LABELS[shift.type] : 'بدون شیفت'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
