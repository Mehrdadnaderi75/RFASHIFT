
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface Props {
  users: User[];
  onLogin: (user: User) => void;
  onBack: () => void;
}

const UserLogin: React.FC<Props> = ({ users, onLogin, onBack }) => {
  const [pid, setPid] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const user = users.find(u => u.personnelId === pid && u.password === pass && u.role === UserRole.USER);
    if (user) {
      onLogin(user);
    } else {
      setError('شماره پرسنلی یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="p-8 h-screen flex flex-col justify-center">
      <button onClick={onBack} className="absolute top-6 right-6 text-gray-500 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-900">ورود کاربر</h2>
        <p className="text-gray-500">برای مشاهده شیفت‌ها وارد شوید</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شماره پرسنلی</label>
          <input 
            type="text"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="مثلاً ۱۲۳"
            value={pid}
            onChange={(e) => setPid(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
          <input 
            type="password"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="****"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button 
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
        >
          ورود به حساب کاربری
        </button>
      </div>
    </div>
  );
};

export default UserLogin;
