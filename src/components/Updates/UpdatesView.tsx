import React, { useState } from 'react';
import {
  DownloadCloud,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  Zap,
  Clock,
  Laptop,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UpdatesView: React.FC = () => {
  const {
    appUpdate,
    isCheckingUpdate,
    checkForUpdates,
    toggleAutoCheckUpdates,
    language,
  } = useApp();

  const [checkSuccessAlert, setCheckSuccessAlert] = useState(false);

  const handleManualCheck = async () => {
    await checkForUpdates();
    setCheckSuccessAlert(true);
    setTimeout(() => setCheckSuccessAlert(false), 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <DownloadCloud className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-100">
              {language === 'bn'
                ? 'স্বয়ংক্রিয় অ্যাপ আপডেট ও সিস্টেম ইঞ্জিনিয়ারিং'
                : 'Automatic App Updates & OTA Engine'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'OmniChat স্বয়ংক্রিয়ভাবে নতুন সংস্করণ, সিকিউরিটি প্যাচ এবং ইমো ও হোয়াটসঅ্যাপ প্রোটোকল আপডেটের জন্য চেক করে অ্যাপকে সবসময় দ্রুত ও নিরাপদ রাখে।'
              : 'OmniChat automatically verifies new OTA patches, security fixes, and protocol updates.'}
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={handleManualCheck}
            disabled={isCheckingUpdate}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
            <span>
              {isCheckingUpdate
                ? language === 'bn'
                  ? 'সার্ভারে আপডেট খোঁজা হচ্ছে...'
                  : 'Checking server...'
                : language === 'bn'
                ? 'এখনই আপডেট চেক করুন'
                : 'Check for Updates'}
            </span>
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {checkSuccessAlert && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 flex items-center gap-2.5 text-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            {language === 'bn'
              ? 'সার্ভার চেক সম্পন্ন হয়েছে: আপনার অ্যাপটি বর্তমানে সর্বশেষ সংস্করণ v2.4.2-এ আপ-টু-ডেট রয়েছে!'
              : 'Server check complete: Your application is currently on the latest version v2.4.2!'}
          </span>
        </div>
      )}

      {/* Version Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Version Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'bn' ? 'বর্তমান ইনস্টল্ড ভার্সন' : 'Current Version'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              সক্রিয়
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-slate-100">
            {appUpdate.currentVersion}
          </div>
          <p className="text-xs text-slate-400">
            রিলিজ তারিখ: <span className="text-slate-200">{appUpdate.releaseDate}</span>
          </p>
        </div>

        {/* Auto-check Updates Toggle */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-200 text-sm">
                {language === 'bn' ? 'অটো-আপডেট চেকিং' : 'Auto Check Updates'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'bn' ? 'ব্যাকগ্রাউন্ডে স্বয়ংক্রিয় চেক চালু' : 'Check automatically on Wi-Fi'}
              </p>
            </div>
            <button
              onClick={toggleAutoCheckUpdates}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                appUpdate.autoCheckUpdates ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  appUpdate.autoCheckUpdates ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              ></div>
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>চেকিং ফ্রিকোয়েন্সি: প্রতি ২৪ ঘণ্টায় ১ বার</span>
          </div>
        </div>

        {/* Security & Stability Status */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Shield className="w-4 h-4" />
            <h3 className="font-semibold text-slate-200 text-sm">
              {language === 'bn' ? 'সিকিউরিটি চ্যানেল' : 'Security Channel'}
            </h3>
          </div>
          <div className="text-sm font-semibold text-slate-100">
            স্ট্যাবল প্রোডাকশন বিল্ড (Stable)
          </div>
          <p className="text-xs text-slate-400">
            অটোমেটিক হটফিক্স ও এনক্রিপশন লাইব্রেরি আপগ্রেড এনাবল্ড রয়েছে।
          </p>
        </div>
      </div>

      {/* Changelog & Release Notes */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-slate-100">
              {language === 'bn'
                ? `সংস্করণ ${appUpdate.currentVersion}-এর নতুন সুবিধাসমূহ (Change Log)`
                : `Version ${appUpdate.currentVersion} Release Notes`}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Build #8924</span>
        </div>

        <ul className="space-y-3 pt-2">
          {appUpdate.changelog.map((log, index) => (
            <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
              <span className="leading-relaxed">{log}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
