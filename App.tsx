
import React, { useState, useEffect } from 'react';

type Step = 'loading' | 'start' | 'add' | 'sub' | 'subtractOriginal' | 'reveal';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('loading');
  const [constA, setConstA] = useState(0);
  const [constB, setConstB] = useState(0);

  // Initialize random constants for the trick
  const initGame = () => {
    const a = Math.floor(Math.random() * 9) + 2; // 2-10
    const b = Math.floor(Math.random() * (a - 1)) + 1; // 1 to a-1 (to keep result positive)
    setConstA(a);
    setConstB(b);
    setStep('start');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initGame();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const nextStep = (current: Step) => {
    const sequence: Step[] = ['start', 'add', 'sub', 'subtractOriginal', 'reveal'];
    const nextIdx = sequence.indexOf(current) + 1;
    if (nextIdx < sequence.length) {
      setStep(sequence[nextIdx]);
    }
  };

  if (step === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#000814]">
        <div className="relative animate-float">
          <div className="absolute inset-0 bg-yellow-500 blur-[60px] opacity-20 rounded-full"></div>
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10">
            <span className="text-4xl font-black text-black">Σ</span>
          </div>
        </div>
        <h1 className="mt-10 text-3xl font-black tracking-widest glow-text">هوش ریاضی</h1>
        <p className="mt-2 text-yellow-500/40 text-[10px] uppercase font-bold tracking-[0.5em]">Math Intelligence AI</p>
        <div className="mt-12 w-12 h-1 w-full max-w-[100px] bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }

  const StepCard = ({ children, title, description, buttonText, onBtnClick }: any) => (
    <div className="h-full flex flex-col p-8 justify-between animate-in">
      <div className="pt-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6">
          مرحله {title}
        </div>
        {children}
      </div>
      <div className="mb-12">
        <p className="text-white/40 text-center text-xs mb-8 leading-relaxed font-medium">
          {description}
        </p>
        <button 
          onClick={onBtnClick}
          className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black text-lg shadow-[0_20px_40px_rgba(255,195,0,0.15)] active:scale-95 transition-all"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-[#000814] text-white">
      {step === 'start' && (
        <StepCard 
          title="اول"
          description="یک عدد دلخواه در ذهن خود انتخاب کنید. (مثلاً ۵، ۱۰ یا هر عدد دیگری)"
          buttonText="عدد را انتخاب کردم"
          onBtnClick={() => nextStep('start')}
        >
          <h2 className="text-3xl font-black mb-4">انتخاب عدد</h2>
          <div className="text-6xl my-8">🧠</div>
        </StepCard>
      )}

      {step === 'add' && (
        <StepCard 
          title="دوم"
          description={`حالا عدد ذهنی خود را با عدد ${constA} جمع بزنید.`}
          buttonText="انجام دادم"
          onBtnClick={() => nextStep('add')}
        >
          <h2 className="text-3xl font-black mb-4">عملیات جمع</h2>
          <div className="my-8 flex flex-col items-center gap-4">
             <span className="text-2xl opacity-30 font-bold">عدد ذهنی</span>
             <span className="text-4xl text-yellow-500">+</span>
             <span className="text-6xl glow-text font-black">{constA}</span>
          </div>
        </StepCard>
      )}

      {step === 'sub' && (
        <StepCard 
          title="سوم"
          description={`حالا از حاصل به دست آمده، عدد ${constB} را کم کنید.`}
          buttonText="کم کردم"
          onBtnClick={() => nextStep('sub')}
        >
          <h2 className="text-3xl font-black mb-4">عملیات تفریق</h2>
          <div className="my-8 flex flex-col items-center gap-4">
             <span className="text-xl opacity-30 font-bold">جواب ذهنی قبلی</span>
             <span className="text-4xl text-yellow-500">-</span>
             <span className="text-6xl glow-text font-black">{constB}</span>
          </div>
        </StepCard>
      )}

      {step === 'subtractOriginal' && (
        <StepCard 
          title="چهارم"
          description="حالا همان عدد اولی که در ذهنتان انتخاب کرده بودید را از حاصل فعلی کم کنید."
          buttonText="محاسبه نهایی"
          onBtnClick={() => nextStep('subtractOriginal')}
        >
          <h2 className="text-3xl font-black mb-4">مرحله نهایی</h2>
          <div className="my-8 flex flex-col items-center gap-4">
             <span className="text-xl opacity-30 font-bold">جواب ذهنی قبلی</span>
             <span className="text-4xl text-yellow-500">-</span>
             <span className="text-2xl opacity-30 font-bold">عدد ذهنی</span>
          </div>
        </StepCard>
      )}

      {step === 'reveal' && (
        <div className="h-full flex flex-col items-center justify-center p-8 animate-in bg-gradient-to-b from-[#000814] to-[#001d3d]">
          <div className="text-yellow-500/40 text-[10px] font-black uppercase tracking-[0.4em] mb-4">تحلیل نهایی</div>
          <h2 className="text-2xl font-bold mb-10 text-white/80 italic text-center">من حدس می‌زنم جواب شما...</h2>
          
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-yellow-500 blur-[80px] opacity-30 animate-pulse"></div>
            <div className="w-48 h-48 glass-card flex items-center justify-center relative z-10 border-yellow-500/40 border-2">
              <span className="text-8xl font-black text-yellow-500 glow-text">{constA - constB}</span>
            </div>
          </div>

          <h3 className="text-xl font-black mb-12 text-center">عدد {constA - constB} است! درست بود؟</h3>

          <button 
            onClick={initGame}
            className="w-full max-w-xs border-2 border-yellow-500 text-yellow-500 py-4 rounded-2xl font-black hover:bg-yellow-500 hover:text-black transition-all"
          >
            بازی مجدد ↺
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
