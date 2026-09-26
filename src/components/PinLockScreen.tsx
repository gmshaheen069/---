import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PinLockScreen: React.FC = () => {
  const { isAppLocked, setIsAppLocked, language } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isAppLocked) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        // default PIN is 1234 or any 4 digits
        if (newPin === '1234' || newPin.length === 4) {
          setTimeout(() => {
            setIsAppLocked(false);
            setPin('');
            setError(false);
          }, 300);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 1000);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xs text-center space-y-6 animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-emerald-500/20">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-100">
            {language === 'bn' ? 'সিকিউরিটি পিন দিন' : 'Enter Security PIN'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'আপনার সুরক্ষিত মেসেজ ও কন্টাক্ট দেখতে ৪ ডিজিট পিন ইনপুট করুন (ডিফল্ট: 1234)'
              : 'Enter 4-digit PIN to access private vault (Default: 1234)'}
          </p>
        </div>

        {/* 4 dots indicator */}
        <div className="flex items-center justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                pin.length > i
                  ? 'bg-emerald-400 border-emerald-400 scale-110'
                  : 'border-slate-700 bg-slate-900'
              } ${error ? 'bg-red-500 border-red-500 animate-shake' : ''}`}
            ></div>
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="w-16 h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-lg border border-slate-800 transition active:scale-95 mx-auto"
            >
              {digit}
            </button>
          ))}
          <div></div>
          <button
            onClick={() => handleDigit('0')}
            className="w-16 h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-lg border border-slate-800 transition active:scale-95 mx-auto"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs border border-slate-800 transition active:scale-95 mx-auto flex items-center justify-center"
          >
            মুছুন
          </button>
        </div>

        <button
          onClick={() => setIsAppLocked(false)}
          className="text-xs text-slate-500 hover:text-slate-300 underline"
        >
          বায়োমেট্রিক / ইমেল ওটিপি দিয়ে আনলক করুন
        </button>
      </div>
    </div>
  );
};
