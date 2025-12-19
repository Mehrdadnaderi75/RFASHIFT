
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, AppData, UserRole, ShiftType, LogType, LogStatus } from './types';
import { STORAGE_KEY, INITIAL_SUPER_ADMIN, SHIFT_LABELS, SHIFT_COLORS, SHIFT_ICONS } from './constants';
import { getCurrentPersianYearMonth, getDaysInMonth, PERSIAN_MONTH_NAMES, getPersianDate } from './dateUtils';

const App: React.FC = () => {
  const [view, setView] = useState<string>('welcome');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  // --- State Management ---
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const base: AppData = { users: [INITIAL_SUPER_ADMIN], shifts: [], messages: [], activityLogs: [] };
    if (saved) {
      try {
        const p = JSON.parse(saved);
        const users = Array.isArray(p.users) ? p.users : base.users;
        if (!users.find((u: any) => u.role === UserRole.SUPER_ADMIN)) users.push(INITIAL_SUPER_ADMIN);
        return { ...base, ...p, users };
      } catch { return base; }
    }
    return base;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  const logout = () => { setCurrentUser(null); setView('welcome'); };

  // --- Views ---

  const WelcomeView = () => (
    <div className="flex flex-col items-center justify-between h-full p-8 pt-20 bg-[#000814]">
      <div className="flex flex-col items-center animate-slide-up">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl neon-glow rotate-3 mb-8">
          <span className="text-3xl font-black text-black">RFA</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2">RFASHIFT</h1>
        <p className="text-yellow-500/60 text-[10px] uppercase font-bold tracking-[0.4em]">Integrated Flow Management</p>
      </div>
      <div className="w-full space-y-4 max-w-xs mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <button onClick={() => setView('user-login')} className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">ورود پرسنل راهبر</button>
        <button onClick={() => setView('admin-login')} className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl font-bold active:scale-95 transition-all">پنل مدیران واحد</button>
        <button onClick={() => setView('super-login')} className="w-full text-white/20 py-4 text-[11px] font-bold uppercase tracking-widest">Root Console</button>
      </div>
    </div>
  );

  const LoginView = ({ role, onBack }: { role: UserRole, onBack: () => void }) => {
    const [pid, setPid] = useState('');
    const [pass, setPass] = useState('');
    const [err, setErr] = useState('');
    const handle = () => {
      const u = data.users.find(x => x.personnelId === pid && x.password === pass && x.role === role);
      if (u) { setCurrentUser(u); setView(role.toLowerCase() + '-dash'); }
      else setErr('اطلاعات نامعتبر است');
    };
    return (
      <div className="h-full p-8 flex flex-col justify-center bg-[#000814] animate-slide-up">
        <button onClick={onBack} className="absolute top-12 right-8 text-white/40 text-2xl">✕</button>
        <h2 className="text-3xl font-black mb-10 text-white">احراز هویت <span className="text-yellow-500 text-sm block mt-2 opacity-60 uppercase tracking-widest">{role} ACCESS</span></h2>
        <div className="space-y-6">
          <input type="text" placeholder="کد پرسنلی" className="w-full glass p-5 rounded-2xl text-white outline-none border border-white/10 focus:border-yellow-500/50 transition-all font-bold" value={pid} onChange={e => setPid(e.target.value)} />
          <input type="password" placeholder="گذرواژه" className="w-full glass p-5 rounded-2xl text-white outline-none border border-white/10 focus:border-yellow-500/50 transition-all font-bold" value={pass} onChange={e => setPass(e.target.value)} />
          {err && <p className="text-red-500 text-center text-xs font-bold">{err}</p>}
          <button onClick={handle} className="w-full bg-yellow-500 text-black font-black py-5 rounded-2xl shadow-2xl active:scale-95 transition-all">تایید و ورود</button>
        </div>
      </div>
    );
  };

  const UserDash = () => {
    const { year, month } = getCurrentPersianYearMonth();
    const [vMonth, setVMonth] = useState(month);
    const shifts = data.shifts.filter(s => s.personnelId === currentUser?.personnelId);
    const days = getDaysInMonth(year, vMonth);

    return (
      <div className="h-full flex flex-col bg-[#000814] text-white">
        <div className="p-8 pt-12 glass rounded-b-[3rem] flex justify-between items-center">
          <div>
            <p className="text-yellow-500 text-[10px] font-black tracking-widest mb-1 uppercase">Personnel Dashboard</p>
            <h2 className="text-xl font-black">{currentUser?.name}</h2>
          </div>
          <button onClick={logout} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-red-500">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar pb-20">
          <div className="flex items-center justify-between glass p-4 rounded-2xl sticky top-0 z-20">
            <button onClick={() => setVMonth(m => m === 1 ? 12 : m - 1)} className="text-yellow-500">◀</button>
            <span className="font-bold text-sm">{PERSIAN_MONTH_NAMES[vMonth-1]} {year}</span>
            <button onClick={() => setVMonth(m => m === 12 ? 1 : m + 1)} className="text-yellow-500">▶</button>
          </div>
          {Array.from({ length: days }).map((_, i) => {
            const d = i + 1;
            const ds = `${year}-${vMonth.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
            const s = shifts.find(x => x.date === ds);
            return (
              <div key={d} className={`flex items-center gap-4 glass p-4 rounded-2xl border-r-4 animate-slide-up ${s ? SHIFT_COLORS[s.type].replace('bg-','border-') : 'border-white/5'}`}>
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center font-bold text-sm">{d}</div>
                <div className="flex-1">
                  <p className="text-[9px] text-white/30 font-bold mb-1">{ds}</p>
                  <p className={`text-xs font-bold ${s ? '' : 'text-white/10 italic'}`}>{s ? SHIFT_LABELS[s.type] : 'بدون برنامه'}</p>
                </div>
                <div className="text-xl">{s ? SHIFT_ICONS[s.type] : '⚪'}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const AdminDash = () => {
    const [targetId, setTargetId] = useState('');
    const [date, setDate] = useState(getPersianDate());
    const users = data.users.filter(u => u.role === UserRole.USER);

    const setShift = (type: ShiftType) => {
      if (!targetId) return alert('نیرو را انتخاب کنید');
      const updated = [...data.shifts];
      const idx = updated.findIndex(x => x.personnelId === targetId && x.date === date);
      if (idx > -1) updated[idx].type = type;
      else updated.push({ personnelId: targetId, date, type });
      setData({ ...data, shifts: updated });
      alert('ثبت شد');
    };

    return (
      <div className="h-full flex flex-col bg-[#000814] text-white">
        <div className="p-8 pt-12 glass rounded-b-[3rem] flex justify-between items-center">
          <h2 className="text-xl font-black italic">ADMIN PANEL</h2>
          <button onClick={logout} className="text-white/40">خروج</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-xs font-black text-yellow-500 uppercase tracking-widest">Assign Shift</h3>
            <select className="w-full glass p-4 rounded-2xl text-xs outline-none border-none text-white" value={targetId} onChange={e => setTargetId(e.target.value)}>
              <option value="">انتخاب پرسنل...</option>
              {users.map(u => <option key={u.personnelId} value={u.personnelId}>{u.name}</option>)}
            </select>
            <input type="text" className="w-full glass p-4 rounded-2xl text-xs text-center font-bold text-yellow-500" value={date} onChange={e => setDate(e.target.value)} />
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(ShiftType).map(t => (
                <button key={t} onClick={() => setShift(t as ShiftType)} className="glass py-4 rounded-xl text-[9px] font-black hover:bg-yellow-500 hover:text-black transition-all">
                  {SHIFT_LABELS[t as ShiftType].split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isReady) return (
    <div className="h-full flex items-center justify-center bg-[#000814]">
      <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="h-full w-full max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {view === 'welcome' && <WelcomeView />}
      {view === 'user-login' && <LoginView role={UserRole.USER} onBack={() => setView('welcome')} />}
      {view === 'admin-login' && <LoginView role={UserRole.ADMIN} onBack={() => setView('welcome')} />}
      {view === 'super-login' && <LoginView role={UserRole.SUPER_ADMIN} onBack={() => setView('welcome')} />}
      {view === 'user-dash' && <UserDash />}
      {view === 'admin-dash' && <AdminDash />}
      {view === 'super-dash' && <div className="p-20 text-center">Root Dashboard... <button onClick={logout}>Back</button></div>}
    </div>
  );
};

export default App;
