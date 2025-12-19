
import React from 'react';

interface Props {
  onAdminLogin: () => void;
  onUserLogin: () => void;
  onSuperAdminLogin: () => void;
}

const Welcome: React.FC<Props> = ({ onAdminLogin, onUserLogin, onSuperAdminLogin }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full bg-[#000814] text-white p-8 pt-20">
      <div className="flex flex-col items-center animate-fade-up">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 rounded-full scale-150"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl">
            <span className="text-3xl font-black text-black">RFA</span>
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2">RFASHIFT</h1>
        <p className="text-yellow-500/60 text-[10px] uppercase font-bold tracking-[0.4em]">Integrated Flow Management</p>
      </div>

      <div className="w-full space-y-4 max-w-sm mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <button 
          onClick={onUserLogin} 
          className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(255,195,0,0.2)] active:scale-95 transition-all"
        >
          ورود پرسنل راهبر
        </button>
        
        <button 
          onClick={onAdminLogin} 
          className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-bold hover:bg-white/10 active:scale-95 transition-all"
        >
          پنل مدیران واحد
        </button>

        <button 
          onClick={onSuperAdminLogin} 
          className="w-full text-white/20 py-4 text-[11px] font-bold uppercase tracking-widest hover:text-yellow-500 transition-colors"
        >
          Access Root Console
        </button>
      </div>

      <div className="text-[10px] text-white/20 font-bold mb-8 uppercase tracking-widest">
        Aria Process Solutions • 2025
      </div>
    </div>
  );
};

export default Welcome;
