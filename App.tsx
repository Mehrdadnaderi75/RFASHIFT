
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { User, AppData, UserRole } from './types';
import { STORAGE_KEY, INITIAL_SUPER_ADMIN } from './constants';
import Welcome from './pages/Welcome';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import SuperAdminLogin from './pages/SuperAdminLogin';

const App: React.FC = () => {
  const [view, setView] = useState<string>('welcome');
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [data, setData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const base: AppData = { users: [INITIAL_SUPER_ADMIN], shifts: [], messages: [], activityLogs: [] };
      if (saved) {
        const parsed = JSON.parse(saved);
        // اطمینان از وجود کاربر مدیر اصلی در دیتابیس محلی
        const users = Array.isArray(parsed.users) ? parsed.users : base.users;
        if (!users.find(u => u.role === UserRole.SUPER_ADMIN)) {
          users.push(INITIAL_SUPER_ADMIN);
        }
        return {
          users: users,
          shifts: Array.isArray(parsed.shifts) ? parsed.shifts : [],
          messages: Array.isArray(parsed.messages) ? parsed.messages : [],
          activityLogs: Array.isArray(parsed.activityLogs) ? parsed.activityLogs : []
        };
      }
      return base;
    } catch { return { users: [INITIAL_SUPER_ADMIN], shifts: [], messages: [], activityLogs: [] }; }
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    if (user.role === UserRole.SUPER_ADMIN) setView('super-dash');
    else if (user.role === UserRole.ADMIN) setView('admin-dash');
    else setView('user-dash');
  }, []);

  const updateData = useCallback((newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const logout = () => {
    setCurrentUser(null);
    setView('welcome');
  };

  if (!isReady) return (
    <div className="h-full bg-[#001529] flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-xs font-bold tracking-widest text-yellow-500 opacity-70 uppercase">RFA System Loading</p>
    </div>
  );

  return (
    <div className="h-full w-full max-w-lg mx-auto bg-white overflow-hidden shadow-2xl relative">
      <Suspense fallback={<div className="bg-[#001529] h-full" />}>
        {view === 'welcome' && (
          <Welcome 
            onAdminLogin={() => setView('admin-login')} 
            onUserLogin={() => setView('user-login')} 
            onSuperAdminLogin={() => setView('super-login-page')} 
          />
        )}
        
        {view === 'admin-login' && <AdminLogin users={data.users} onLogin={handleLogin} onBack={() => setView('welcome')} />}
        {view === 'user-login' && <UserLogin users={data.users} onLogin={handleLogin} onBack={() => setView('welcome')} />}
        {view === 'super-login-page' && <SuperAdminLogin users={data.users} onLogin={handleLogin} onBack={() => setView('welcome')} />}

        {currentUser && (
          <div className="h-full w-full">
            {view === 'user-dash' && <UserDashboard currentUser={currentUser} data={data} updateData={updateData} onLogout={logout} />}
            {view === 'admin-dash' && <AdminDashboard currentUser={currentUser} data={data} updateData={updateData} onLogout={logout} />}
            {view === 'super-dash' && <SuperAdminDashboard currentUser={currentUser} data={data} updateData={updateData} onLogout={logout} />}
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default App;
