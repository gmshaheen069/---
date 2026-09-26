import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Mail,
  Key,
  Lock,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Clock,
  MapPin,
  Laptop,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SecurityView: React.FC = () => {
  const {
    twoFactorEnabled,
    setTwoFactorEnabled,
    twoFactorMethod,
    setTwoFactorMethod,
    appPinEnabled,
    setAppPinEnabled,
    userEmail,
    securitySessions,
    language,
  } = useApp();

  const [isTest2FAModalOpen, setIsTest2FAModalOpen] = useState(false);
  const [testOtp, setTestOtp] = useState(['', '', '', '', '', '']);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pinCode, setPinCode] = useState('1234');
  const [showQrModal, setShowQrModal] = useState(false);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...testOtp];
    updated[index] = val;
    setTestOtp(updated);

    // auto focus next input if applicable
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyTestOtp = () => {
    const code = testOtp.join('');
    if (code.length === 6) {
      setTestStatus('success');
      setTimeout(() => {
        setIsTest2FAModalOpen(false);
        setTestStatus('idle');
        setTestOtp(['', '', '', '', '', '']);
      }, 2000);
    } else {
      setTestStatus('error');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-100">
              {language === 'bn'
                ? 'টু-ফ্যাক্টর অথেনটিকেশন (2FA) ও ডেটা সিকিউরিটি'
                : 'Two-Factor Authentication (2FA) & Security'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'আপনার ইমো, হোয়াটসঅ্যাপ, মেসেঞ্জার বার্তা এবং সুরক্ষিত কন্টাক্টগুলোর অতিরিক্ত নিরাপত্তার জন্য 2FA এবং বায়োমেট্রিক অ্যাপ-লক সুরক্ষা সক্রিয় রাখুন।'
              : 'Keep your unified messages, contacts, and cloud backups fully protected with two-factor verification and app-lock security.'}
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setIsTest2FAModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>{language === 'bn' ? '2FA ভেরিফিকেশন টেস্ট করুন' : 'Test 2FA OTP'}</span>
          </button>
        </div>
      </div>

      {/* Main 2FA Configuration & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2FA Master Switch & Method Selection */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                {language === 'bn' ? 'টু-ফ্যাক্টর অথেনটিকেশন (2FA)' : 'Two-Factor Authentication'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'লগইন বা সংবেদনশীল বার্তা দেখার সময় ওটিপি কোড চাওয়া হবে'
                  : 'Requires an OTP code when logging in or viewing sensitive messages'}
              </p>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              ></div>
            </button>
          </div>

          {/* Method Radios */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300">
              {language === 'bn' ? 'যাচাইকরণের মাধ্যম নির্বাচন করুন' : 'Select Primary 2FA Method'}
            </h3>

            {/* Email OTP */}
            <div
              onClick={() => setTwoFactorMethod('email')}
              className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                twoFactorMethod === 'email'
                  ? 'bg-emerald-950/20 border-emerald-500/50'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-sky-400 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-xs">
                    {language === 'bn' ? 'ইমেল ওটিপি কোড (Email OTP)' : 'Email OTP Verification'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'bn'
                      ? `প্রতিবার লগইন করলে ${userEmail} ঠিকানায় ৬ সংখ্যার কোড পাঠানো হবে।`
                      : `A 6-digit one-time code will be sent to ${userEmail}.`}
                  </p>
                </div>
              </div>
              <input
                type="radio"
                name="2fa-method"
                checked={twoFactorMethod === 'email'}
                onChange={() => setTwoFactorMethod('email')}
                className="mt-1 text-emerald-500"
              />
            </div>

            {/* SMS OTP */}
            <div
              onClick={() => setTwoFactorMethod('sms')}
              className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                twoFactorMethod === 'sms'
                  ? 'bg-emerald-950/20 border-emerald-500/50'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 mt-0.5">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-xs">
                    {language === 'bn' ? 'মোবাইল এসএমএস (SMS OTP)' : 'Mobile SMS OTP'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'bn'
                      ? 'আপনার সংরক্ষিত মোবাইল নাম্বারে ইনস্ট্যান্ট এসএমএস কোড পাঠানো হবে।'
                      : 'Send instant SMS code to your registered mobile number.'}
                  </p>
                </div>
              </div>
              <input
                type="radio"
                name="2fa-method"
                checked={twoFactorMethod === 'sms'}
                onChange={() => setTwoFactorMethod('sms')}
                className="mt-1 text-emerald-500"
              />
            </div>

            {/* Authenticator App */}
            <div
              onClick={() => {
                setTwoFactorMethod('authenticator');
                setShowQrModal(true);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                twoFactorMethod === 'authenticator'
                  ? 'bg-emerald-950/20 border-emerald-500/50'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 mt-0.5">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-xs">
                    {language === 'bn'
                      ? 'গুগল অথেনটিকেটর / TOTP অ্যাপ'
                      : 'Google Authenticator / TOTP'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'bn'
                      ? 'গুগল অথেনটিকেটর বা মাইক্রোসফট অথেনটিকেটর অ্যাপে QR কোড স্ক্যান করে সংযোগ করুন।'
                      : 'Scan QR code with Google Authenticator or Microsoft Authenticator.'}
                  </p>
                </div>
              </div>
              <input
                type="radio"
                name="2fa-method"
                checked={twoFactorMethod === 'authenticator'}
                onChange={() => setTwoFactorMethod('authenticator')}
                className="mt-1 text-emerald-500"
              />
            </div>
          </div>

          {/* App PIN / Biometric lock */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 text-teal-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">
                  {language === 'bn' ? '৪ ডিজিটের অ্যাপ সিকিউরিটি পিন' : '4-Digit App Security PIN'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {language === 'bn'
                    ? 'অ্যাপ ওপেন করলে বা চ্যাট দেখতে গেলে পিন কোড ইনপুট করতে হবে'
                    : 'Requires 4-digit PIN when opening app or private chats'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAppPinEnabled(!appPinEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                appPinEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  appPinEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Security Health Score Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">
              {language === 'bn' ? 'সিকিউরিটি স্কোর ও নিরীক্ষা' : 'Security Audit Score'}
            </h3>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400"
                    strokeDasharray="98, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-emerald-400 font-mono">
                  98%
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-100">
                  {language === 'bn' ? 'উচ্চ সুরক্ষিত (Protected)' : 'Protected'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === 'bn'
                    ? '2FA সক্রিয়, ব্যাকআপ এনক্রিপ্টেড এবং সকল সেশন নজরদারিতে আছে।'
                    : '2FA active, backups encrypted, all sessions monitored.'}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>টু-ফ্যাক্টর যাচাইকরণ সক্রিয়</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ক্লাউড ভল্ট AES-256 এনক্রিপ্টেড</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ইমেল পুনরুদ্ধার চ্যানেল ভেরিফাইড</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-[11px] text-slate-400">
            {language === 'bn'
              ? 'সর্বশেষ সিকিউরিটি চেক: আজ দুপুর ১২:০০'
              : 'Last security check: Today 12:00 PM'}
          </div>
        </div>
      </div>

      {/* Active Connected Devices and Sessions */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              {language === 'bn' ? 'সক্রিয় ডিভাইস ও সেশন লগ' : 'Active Devices & Sessions'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'বর্তমানে কোন কোন ডিভাইসে আপনার অমনিচ্যাট কানেক্টেড রয়েছে'
                : 'Current devices logged into your account'}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {securitySessions.map((session) => (
            <div
              key={session.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
                  {session.device.includes('Samsung') || session.device.includes('iPad') ? (
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Laptop className="w-4 h-4 text-sky-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 text-xs">{session.device}</span>
                    {session.isCurrent && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                        {language === 'bn' ? 'বর্তমান ডিভাইস' : 'Current'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {session.browser} · IP: {session.ip}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{session.location}</span>
                </div>
                <span className="font-mono text-[11px]">{session.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2FA Test Modal */}
      {isTest2FAModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-100">
                {language === 'bn' ? '2FA ওটিপি ভেরিফিকেশন' : 'Verify 2FA OTP'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'bn'
                  ? `${userEmail}-এ পাঠানো ৬ ডিজিটের কোডটি লিখুন:`
                  : `Enter the 6-digit code sent to ${userEmail}:`}
              </p>
            </div>

            {/* OTP input boxes */}
            <div className="flex items-center justify-center gap-2">
              {testOtp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-10 h-12 text-center text-lg font-mono font-bold rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                />
              ))}
            </div>

            {testStatus === 'success' && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{language === 'bn' ? 'ওটিপি সফলভাবে যাচাইকৃত!' : 'OTP Verified Successfully!'}</span>
              </div>
            )}

            {testStatus === 'error' && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>{language === 'bn' ? '৬ ডিজিটের কোড সম্পূর্ণ করুন' : 'Please enter 6 digits'}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsTest2FAModalOpen(false)}
                className="w-1/2 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={verifyTestOtp}
                className="w-1/2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                {language === 'bn' ? 'যাচাই করুন' : 'Verify'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authenticator QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm">
                গুগল অথেনটিকেটর QR কোড
              </h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-white rounded-2xl inline-block mx-auto">
              <QrCode className="w-36 h-36 text-slate-950" />
            </div>
            <p className="text-xs text-slate-400">
              আপনার Google Authenticator অ্যাপ ওপেন করে এই কোডটি স্ক্যান করুন।
            </p>
            <p className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-2 rounded-xl border border-slate-800">
              Secret: JBSWY3DPEHPK3PXP
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              সম্পন্ন করেছি
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
