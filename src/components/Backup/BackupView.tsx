import React, { useState } from 'react';
import {
  Cloud,
  CloudUpload,
  RefreshCw,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  HardDrive,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BackupView: React.FC = () => {
  const {
    backups,
    isBackingUp,
    createCloudBackup,
    restoreBackup,
    autoSyncEnabled,
    setAutoSyncEnabled,
    userEmail,
    language,
    conversations,
    contacts,
  } = useApp();

  const [restoreSuccessId, setRestoreSuccessId] = useState<string | null>(null);

  const handleBackupNow = async () => {
    await createCloudBackup();
  };

  const handleRestore = (id: string) => {
    restoreBackup(id);
    setRestoreSuccessId(id);
    setTimeout(() => setRestoreSuccessId(null), 3000);
  };

  const downloadJSONBackup = () => {
    const backupPayload = {
      backupDate: new Date().toISOString(),
      userEmail,
      version: 'v2.4.2',
      data: {
        conversations,
        contacts,
      },
    };
    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnichat_full_backup_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-100">
              {language === 'bn'
                ? 'ক্লাউড সিঙ্ক ও এনক্রিপ্টেড ডেটা ব্যাকআপ'
                : 'Cloud Sync & Encrypted Data Backup'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'আপনার ইমো, হোয়াটসঅ্যাপ, মেসেঞ্জার বার্তা, সমস্ত কন্টাক্ট নাম্বার এবং মিডিয়া ফাইলসমূহ স্বয়ংক্রিয়ভাবে ক্লাউডে ব্যাকআপ থাকে। যেকোনো সময় যেকোনো ডিভাইসে রিস্টোর করতে পারবেন।'
              : 'Automatically sync and backup all your imo, WhatsApp, Messenger messages, contact numbers, and media files securely with AES-256 cloud encryption.'}
          </p>
          <p className="text-xs text-slate-300 pt-1 flex items-center gap-2">
            <span className="text-slate-400">সিঙ্ক গন্তব্য:</span>
            <span className="font-mono text-emerald-400 font-semibold">{userEmail}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={handleBackupNow}
            disabled={isBackingUp}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
          >
            <CloudUpload className={`w-4 h-4 ${isBackingUp ? 'animate-bounce' : ''}`} />
            <span>
              {isBackingUp
                ? language === 'bn'
                  ? 'ব্যাকআপ নেওয়া হচ্ছে...'
                  : 'Backing up...'
                : language === 'bn'
                ? 'এখনই ক্লাউড ব্যাকআপ নিন'
                : 'Backup Now'}
            </span>
          </button>

          <button
            onClick={downloadJSONBackup}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>{language === 'bn' ? 'অফলাইন স্ন্যাপশট ডাউনলোড' : 'Download JSON'}</span>
          </button>
        </div>
      </div>

      {/* Cloud Storage & Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Storage Meter */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              {language === 'bn' ? 'ক্লাউড স্টোরেজ মিটার' : 'Cloud Storage'}
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">32% ব্যবহৃত</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-2xl font-bold font-mono text-slate-100">4.8 GB</span>
              <span className="text-slate-400 font-mono">/ 15 GB মোট কোটা</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '32%' }}></div>
            </div>
          </div>

          <div className="pt-2 space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex justify-between">
              <span>মেসেজ ও চ্যাট ডেটা:</span>
              <span className="text-slate-200 font-mono">1.2 GB</span>
            </div>
            <div className="flex justify-between">
              <span>কন্টাক্টস ও ফোনবুক:</span>
              <span className="text-slate-200 font-mono">48 MB</span>
            </div>
            <div className="flex justify-between">
              <span>ছবি, অডিও ও ফাইল:</span>
              <span className="text-slate-200 font-mono">3.5 GB</span>
            </div>
          </div>
        </div>

        {/* Auto-Sync Settings */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-sky-400" />
                {language === 'bn' ? 'স্বয়ংক্রিয় ব্যাকগ্রাউন্ড সিঙ্ক' : 'Auto-Sync'}
              </h3>
              <button
                onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                    autoSyncEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'ইন্টারনেট কানেকশন পেলেই নতুন যেকোনো ইমো, হোয়াটসঅ্যাপ বার্তা বা সেভ করা ফোন নাম্বার সাথে সাথে ক্লাউডে ব্যাকআপ হয়ে যাবে।'
                : 'Automatically updates your cloud backup whenever new messages or numbers are added.'}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-teal-400 shrink-0" />
            <span>সিঙ্ক ইন্টারভ্যাল: প্রতি ঘণ্টায় স্বয়ংক্রিয়</span>
          </div>
        </div>

        {/* Security & Encryption Seal */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-slate-200 text-sm">
                {language === 'bn' ? 'এনক্রিপশন ও গোপনীয়তা' : 'Encryption & Privacy'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'আপনার সকল ব্যক্তিগত ব্যাকআপ ক্লাউডে সঞ্চিত হওয়ার পূর্বে মিলিশিয়া-গ্রেড AES-256 বিট অ্যালগরিদমে এনক্রিপ্ট করা হয়।'
                : 'All backups are locked with military-grade AES-256 bit zero-knowledge client encryption.'}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>জিরো-নলেজ সিকিউরিটি ভল্ট সক্রিয়</span>
          </div>
        </div>
      </div>

      {/* Backup History Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              {language === 'bn' ? 'ক্লাউড ব্যাকআপ হিস্ট্রি ও রিস্টোর পয়েন্ট' : 'Backup History & Restore Points'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'যেকোনো ব্যাকআপ পয়েন্ট সিলেক্ট করে পূর্বের ডেটা ফিরিয়ে আনুন'
                : 'Select any restore point to recover past messages and contacts'}
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {backups.length} টি ব্যাকআপ পয়েন্ট সংরক্ষিত
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">তারিখ ও সময়</th>
                <th className="pb-3 font-semibold">টাইপ</th>
                <th className="pb-3 font-semibold">সাইজ</th>
                <th className="pb-3 font-semibold">আইটেম সংখ্যা</th>
                <th className="pb-3 font-semibold">স্ট্যাটাস</th>
                <th className="pb-3 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 font-medium text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>{b.date}</span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        b.type === 'cloud'
                          ? 'bg-sky-950/60 text-sky-400 border-sky-800/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {b.type === 'cloud' ? 'ক্লাউড (Cloud)' : 'লোকাল (Local)'}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-slate-300">{b.size}</td>
                  <td className="py-3.5 text-slate-400">
                    {b.itemCount.messages} মেসেজ · {b.itemCount.contacts} কন্টাক্ট
                  </td>
                  <td className="py-3.5">
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      সম্পন্ন
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleRestore(b.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                        restoreSuccessId === b.id
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      {restoreSuccessId === b.id ? '✓ রিস্টোর হয়েছে' : 'রিস্টোর করুন'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
