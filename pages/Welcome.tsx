
import React from 'react';

interface Props {
  onAdminLogin: () => void;
  onUserLogin: () => void;
  onSuperAdminLogin: () => void;
}

const Welcome: React.FC<Props> = ({ onAdminLogin, onUserLogin, onSuperAdminLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#001529] text-white p-8 text-center">
      <div className="mb-12">
        <div className="w-24 h-24 bg-yellow-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-500/20 rotate-3 transition-transform hover:rotate-0">
          <span className="text-3xl font-black text-[#001529] -rotate-3">RFA</span>
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">Shift RFA</h1>
        <p className="text-blue-300 text-[10px] tracking-[0.3em] uppercase opacity-60">Process Management System</p>
      </div>

      <div className="w-full space-y-4 max-w-xs">
        <button 
          onClick={onUserLogin} 
          className="w-full bg-white text-[#001529] py-5 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all"
        >
          ورود پرسنل فرآیند
        </button>
        
        <button 
          onClick={onAdminLogin} 
          className="w-full bg-blue-600 text-white py-5 rounded-3xl font-bold shadow-xl active:scale-95 transition-all border border-blue-400/20"
        >
          پنل مدیران واحد
        </button>

        <div className="pt-8">
          <button 
            onClick={onSuperAdminLogin} 
            className="w-full bg-yellow-500/10 border border-yellow-500/30 py-4 rounded-2xl text-[11px] text-yellow-500 font-black uppercase tracking-widest hover:bg-yellow-500/20 active:scale-95 transition-all"
          >
            مدیریت ارشد (Super Admin)
          </button>
        </div>
      </div>

      <p className="absolute bottom-10 text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">
        Aria Cloud Infrastructure v3.1
      </p>
    </div>
  );
};

export default Welcome;
