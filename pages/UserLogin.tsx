
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
      setError('اطلاعات ورود نامعتبر است');
    }
  };

  return (
    <div className="h-full bg-[#000814] p-8 flex flex-col justify-center">
      <button onClick={onBack} className="absolute top-12 right-8 text-white/40 text-2xl">✕</button>

      <div className="mb-12 animate-fade-up">
        <h2 className="text-3xl font-black mb-2">احراز هویت</h2>
        <p className="text-yellow-500/60 text-xs font-bold tracking-widest uppercase">Personnel Access Only</p>
      </div>

      <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mr-2">Personnel ID</label>
          <input 
            type="text"
            className="w-full glass p-5 rounded-2xl text-white outline-none border border-white/10 focus:border-yellow-500/50 transition-all font-bold"
            placeholder="مثلاً ۱۲۳"
            value={pid}
            onChange={(e) => setPid(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mr-2">Secure Password</label>
          <input 
            type="password"
            className="w-full glass p-5 rounded-2xl text-white outline-none border border-white/10 focus:border-yellow-500/50 transition-all font-bold"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs text-center font-bold">
            {error}
          </div>
        )}

        <button 
          onClick={handleLogin}
          className="w-full bg-yellow-500 text-black font-black py-5 rounded-2xl shadow-2xl active:scale-95 transition-all mt-8"
        >
          ورود به شبکه راهبران
        </button>
      </div>
    </div>
  );
};

export default UserLogin;
