
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface Props {
  users: User[];
  onLogin: (user: User) => void;
  onBack: () => void;
}

const SuperAdminLogin: React.FC<Props> = ({ users, onLogin, onBack }) => {
  const [pid, setPid] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const user = users.find(u => u.personnelId === pid && u.password === pass && u.role === UserRole.SUPER_ADMIN);
    if (user) {
      onLogin(user);
    } else {
      setError('شماره پرسنلی یا رمز عبور مدیر اصلی اشتباه است');
    }
  };

  return (
    <div className="p-8 h-screen flex flex-col justify-center bg-indigo-50">
      <button onClick={onBack} className="absolute top-6 right-6 text-gray-500 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-indigo-900">ورود مدیر اصلی</h2>
        <p className="text-gray-500">دسترسی به تنظیمات کلان سیستم</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شماره پرسنلی مخصوص</label>
          <input 
            type="text"
            className="w-full p-4 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            placeholder="۱۲۳۴۵۶۷۸۹"
            value={pid}
            onChange={(e) => setPid(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور مخصوص</label>
          <input 
            type="password"
            className="w-full p-4 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            placeholder="********"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        
        {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>}

        <button 
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
        >
          تایید و ورود
        </button>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
