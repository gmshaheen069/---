import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ShieldCheck,
  Mail,
  RefreshCw,
  Phone,
  Check,
  ExternalLink,
  Lock,
  Globe,
  X,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    userEmail,
    isEmailConnected,
    twoFactorEnabled,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsSearchOpen,
    language,
    setLanguage,
    setActiveTab,
    isCheckingUpdate,
    checkForUpdates,
    isAppLocked,
    setIsAppLocked,
    appPinEnabled,
  } = useApp();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'call':
        return <Phone className="w-4 h-4 text-sky-400" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'backup':
        return <RefreshCw className="w-4 h-4 text-teal-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Sync Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-bold text-lg tracking-tight">
            Ω
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-100 tracking-tight">
                {language === 'bn' ? 'কমিউনিকেশন হাব' : 'OmniChat Hub'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {language === 'bn' ? 'লাইভ সিঙ্ক' : 'Live Sync'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {language === 'bn'
                ? 'ইমো · হোয়াটসঅ্যাপ · মেসেঞ্জার · ইমেল · কলিং'
                : 'imo · WhatsApp · Messenger · Email · Free Calls'}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Global Search trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all text-sm group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <span className="text-xs text-slate-400">
              {language === 'bn'
                ? 'সকল মেসেজ, ইমো, হোয়াটসঅ্যাপ ও নাম্বার খুঁজুন...'
                : 'Search all messages, imo, WhatsApp, numbers...'}
            </span>
          </div>
          <kbd className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Email Connected Status Widget */}
        <button
          onClick={() => setActiveTab('contacts')}
          className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition text-xs"
          title="ইমেল দিয়ে ব্যাকআপ করা কন্টাক্টস ভল্ট"
        >
          <Mail className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-300 max-w-[140px] truncate">{userEmail}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>

        {/* 2FA Shield badge */}
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
            twoFactorEnabled
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/40'
              : 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/40'
          }`}
          title="টু-ফ্যাক্টর অথেনটিকেশন (2FA)"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">2FA {twoFactorEnabled ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'বন্ধ' : 'Off')}</span>
        </button>

        {/* Update Checker Button */}
        <button
          onClick={() => checkForUpdates()}
          disabled={isCheckingUpdate}
          className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition relative"
          title={language === 'bn' ? 'অটো-আপডেট চেক করুন' : 'Check for Updates'}
        >
          <RefreshCw className={`w-4 h-4 ${isCheckingUpdate ? 'animate-spin text-emerald-400' : ''}`} />
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition relative"
            title={language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-bold rounded-full text-[10px] flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notification Menu */}
          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden text-sm animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3.5 bg-slate-800/70 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-100">
                    {language === 'bn' ? 'নোটিফিকেশন সেন্টার' : 'Notifications'}
                  </span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {language === 'bn' ? 'সব পঠিত করুন' : 'Mark all read'}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    {language === 'bn' ? 'কোনো নতুন নোটিফিকেশন নেই' : 'No notifications'}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 hover:bg-slate-800/50 cursor-pointer transition flex items-start gap-3 ${
                        !n.isRead ? 'bg-emerald-950/20' : ''
                      }`}
                    >
                      <div className="mt-0.5 p-2 rounded-lg bg-slate-800 border border-slate-700">
                        {getNotifIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-medium text-slate-200 text-xs truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{n.message}</p>
                      </div>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 self-center"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 text-center">
                <button
                  onClick={() => {
                    setIsNotifDropdownOpen(false);
                    setActiveTab('messages');
                  }}
                  className="text-xs text-slate-400 hover:text-emerald-400 transition"
                >
                  {language === 'bn' ? 'সকল মেসেজ দেখতে যান →' : 'View all messages →'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language Switch */}
        <button
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition flex items-center gap-1.5"
          title="Change Language"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
        </button>

        {/* App Lock PIN toggle */}
        {appPinEnabled && (
          <button
            onClick={() => setIsAppLocked(true)}
            className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 hover:bg-amber-900/40 transition"
            title="App Lock"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
