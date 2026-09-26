import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  CloudUpload,
  PhoneCall,
  Share2,
  ShieldCheck,
  DownloadCloud,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    conversations,
    contacts,
    twoFactorEnabled,
    lastEmailSyncTime,
  } = useApp();

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const navItems = [
    {
      id: 'dashboard',
      label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'messages',
      label: language === 'bn' ? 'মেসেজ হাব' : 'Unified Inbox',
      icon: MessageSquare,
      badge: totalUnread > 0 ? totalUnread : null,
      sub: language === 'bn' ? 'ইমো, হোয়াটসঅ্যাপ, মেসেঞ্জার' : 'imo, WhatsApp, Messenger',
    },
    {
      id: 'contacts',
      label: language === 'bn' ? 'কন্টাক্ট ও নাম্বার সেফ' : 'Safe Contacts',
      icon: Users,
      badge: contacts.length,
      sub: language === 'bn' ? 'ইমেল ব্যাকআপ ও রিস্টোর' : 'Email Backup & Restore',
    },
    {
      id: 'call',
      label: language === 'bn' ? 'ফ্রি কল ও লাইভ চ্যাট' : 'Free Calls & Chat',
      icon: PhoneCall,
      badge: language === 'bn' ? 'ফ্রি' : 'Free',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40',
    },
    {
      id: 'backup',
      label: language === 'bn' ? 'ক্লাউড সিঙ্ক ও ব্যাকআপ' : 'Cloud Sync & Backup',
      icon: CloudUpload,
      badge: null,
    },
    {
      id: 'files',
      label: language === 'bn' ? 'ফাইল শেয়ারিং' : 'File Sharing',
      icon: Share2,
      badge: null,
    },
    {
      id: 'security',
      label: language === 'bn' ? 'টু-ফ্যাক্টর সিকিউরিটি' : '2FA & Security',
      icon: ShieldCheck,
      badge: twoFactorEnabled ? 'ON' : 'OFF',
      badgeColor: twoFactorEnabled
        ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40'
        : 'text-amber-400 bg-amber-950/60 border-amber-800/40',
    },
    {
      id: 'updates',
      label: language === 'bn' ? 'সিস্টেম আপডেট' : 'System Updates',
      icon: DownloadCloud,
      badge: 'v2.4.2',
    },
  ];

  return (
    <aside className="w-64 lg:w-72 bg-slate-900/95 border-r border-slate-800/80 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Platform Connectivity Quick Strip */}
      <div className="p-3.5 mx-3 mt-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
          <span>{language === 'bn' ? 'সংযুক্ত প্ল্যাটফর্মসমূহ' : 'Connected Platforms'}</span>
          <span className="text-emerald-400 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {language === 'bn' ? 'সকল সক্রিয়' : 'All Online'}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/30 hover:bg-emerald-900/30 transition">
            <span className="block text-[11px] font-bold text-emerald-400">WA</span>
            <span className="text-[9px] text-slate-400">হোয়াটসঅ্যাপ</span>
          </div>
          <div className="p-1.5 rounded-lg bg-sky-950/30 border border-sky-800/30 hover:bg-sky-900/30 transition">
            <span className="block text-[11px] font-bold text-sky-400">imo</span>
            <span className="text-[9px] text-slate-400">ইমো</span>
          </div>
          <div className="p-1.5 rounded-lg bg-blue-950/30 border border-blue-800/30 hover:bg-blue-900/30 transition">
            <span className="block text-[11px] font-bold text-blue-400">FB</span>
            <span className="text-[9px] text-slate-400">মেসেঞ্জার</span>
          </div>
          <div className="p-1.5 rounded-lg bg-rose-950/30 border border-rose-800/30 hover:bg-rose-900/30 transition">
            <span className="block text-[11px] font-bold text-rose-400">Gmail</span>
            <span className="text-[9px] text-slate-400">ইমেল</span>
          </div>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <div className="text-left truncate">
                  <span className="block truncate font-semibold">{item.label}</span>
                  {item.sub && (
                    <span className="block text-[10px] text-slate-500 font-normal truncate">
                      {item.sub}
                    </span>
                  )}
                </div>
              </div>

              {item.badge !== null && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.badgeColor
                      ? item.badgeColor
                      : 'bg-emerald-500 text-slate-950 font-bold border-transparent'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Cloud Sync & Vault Status Widget */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {language === 'bn' ? 'ক্লাউড ভল্ট সিঙ্ক' : 'Cloud Vault Sync'}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">4.8 / 15 GB</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            style={{ width: '32%' }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span className="truncate">{lastEmailSyncTime}</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-slate-400" />
            AES-256
          </span>
        </div>
      </div>
    </aside>
  );
};
