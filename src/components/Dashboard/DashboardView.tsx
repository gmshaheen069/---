import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  ShieldCheck,
  Cloud,
  ArrowUpRight,
  PhoneCall,
  Download,
  Share2,
  Lock,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    language,
    conversations,
    contacts,
    twoFactorEnabled,
    createCloudBackup,
    isBackingUp,
    restoreContactsFromEmail,
    setActiveTab,
    setIsSearchOpen,
    notifications,
    userEmail,
  } = useApp();

  const [activeGraphTab, setActiveGraphTab] = useState<'volume' | 'platforms' | 'hours'>('volume');
  const [showRestoreSuccess, setShowRestoreSuccess] = useState(false);

  const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0) + 15400;
  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  // 7-day data for charts
  const weeklyData = [
    { day: language === 'bn' ? 'শনি' : 'Sat', whatsapp: 180, imo: 140, messenger: 95, email: 35 },
    { day: language === 'bn' ? 'রবি' : 'Sun', whatsapp: 230, imo: 190, messenger: 120, email: 40 },
    { day: language === 'bn' ? 'সোম' : 'Mon', whatsapp: 310, imo: 210, messenger: 160, email: 85 },
    { day: language === 'bn' ? 'মঙ্গল' : 'Tue', whatsapp: 290, imo: 240, messenger: 145, email: 90 },
    { day: language === 'bn' ? 'বুধ' : 'Wed', whatsapp: 340, imo: 260, messenger: 180, email: 75 },
    { day: language === 'bn' ? 'বৃহঃ' : 'Thu', whatsapp: 380, imo: 290, messenger: 210, email: 95 },
    { day: language === 'bn' ? 'শুক্র' : 'Fri', whatsapp: 420, imo: 320, messenger: 240, email: 50 },
  ];

  const handleRestoreClick = () => {
    restoreContactsFromEmail();
    setShowRestoreSuccess(true);
    setTimeout(() => setShowRestoreSuccess(false), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              {language === 'bn'
                ? 'কমিউনিকেশন হাব কন্ট্রোল ড্যাশবোর্ড'
                : 'OmniChat Unified Dashboard'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'ইমো, হোয়াটসঅ্যাপ এবং ফেসবুক মেসেঞ্জারের সকল বার্তা এক ছাদের নিচে। মোবাইল নাম্বার সেফ ভল্ট, ইমেল সিঙ্ক এবং টু-ফ্যাক্টর সিকিউরিটিতে আপনার যোগাযোগ সম্পূর্ণ সুরক্ষিত।'
              : 'All your messages from imo, WhatsApp, and Facebook Messenger in one unified place with secure contact vault, email sync, and two-factor authentication.'}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={() => createCloudBackup()}
            disabled={isBackingUp}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
          >
            <Cloud className={`w-4 h-4 ${isBackingUp ? 'animate-bounce' : ''}`} />
            <span>
              {isBackingUp
                ? language === 'bn'
                  ? 'সিঙ্ক হচ্ছে...'
                  : 'Syncing...'
                : language === 'bn'
                ? 'ক্লাউড ব্যাকআপ নিন'
                : 'Backup Now'}
            </span>
          </button>

          <button
            onClick={handleRestoreClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            <span>
              {language === 'bn' ? 'ইমেল থেকে নাম্বার রিস্টোর' : 'Restore from Email'}
            </span>
          </button>
        </div>
      </div>

      {/* Restore Success Toast */}
      {showRestoreSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>
              {language === 'bn'
                ? `সফল হয়েছে! ${userEmail} থেকে ক্লাউডে সেভ করা পুরোন সকল ব্যাকআপ নাম্বার সফলভাবে ফোনে রিস্টোর করা হয়েছে।`
                : `Success! Old backup numbers from ${userEmail} have been restored into your safe phonebook.`}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('contacts')}
            className="underline font-semibold hover:text-white"
          >
            {language === 'bn' ? 'কন্টাক্ট দেখুন' : 'View Contacts'}
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Messages */}
        <div
          onClick={() => setActiveTab('messages')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">
              {language === 'bn' ? 'মোট সংগৃহীত মেসেজ' : 'Total Messages'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">
              {totalMessages.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {unreadCount > 0
              ? `${unreadCount} ${language === 'bn' ? 'টি নতুন অপঠিত বার্তা আছে' : 'unread messages'}`
              : language === 'bn'
              ? 'সকল মেসেজ পঠিত'
              : 'All caught up'}
          </p>
        </div>

        {/* Saved Contacts */}
        <div
          onClick={() => setActiveTab('contacts')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">
              {language === 'bn' ? 'সুরক্ষিত মোবাইল নাম্বার' : 'Protected Contacts'}
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">
              {contacts.length}
            </span>
            <span className="text-xs text-sky-400 font-medium">
              {language === 'bn' ? 'ইমেলে এনক্রিপ্টেড' : 'Email Vault'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            {language === 'bn' ? 'ইমেলে ব্যাকআপ করা আছে' : 'Backed up to email'}
          </p>
        </div>

        {/* Cloud Sync Meter */}
        <div
          onClick={() => setActiveTab('backup')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">
              {language === 'bn' ? 'ক্লাউড সিঙ্ক স্টোরেজ' : 'Cloud Storage'}
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
              <Cloud className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">4.8 GB</span>
            <span className="text-xs text-slate-400 font-mono">/ 15 GB</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: '32%' }}></div>
          </div>
        </div>

        {/* Security & 2FA */}
        <div
          onClick={() => setActiveTab('security')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">
              {language === 'bn' ? 'সিকিউরিটি স্তর (2FA)' : '2FA Security Shield'}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">98%</span>
            <span className="text-xs text-slate-400 font-medium">
              {twoFactorEnabled
                ? language === 'bn'
                  ? 'উচ্চ নিরাপত্তা'
                  : 'High Security'
                : language === 'bn'
                ? 'সতর্কতা'
                : 'Attention'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            {twoFactorEnabled
              ? language === 'bn'
                ? 'টু-ফ্যাক্টর সক্রিয় রয়েছে'
                : '2FA active & verified'
              : language === 'bn'
              ? '2FA সক্রিয় করুন'
              : 'Enable 2FA now'}
          </p>
        </div>
      </div>

      {/* Main Graphs & Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Traffic Interactive Graph */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                {language === 'bn'
                  ? 'মেসেজিং ভলিউম ও ট্র্যাফিক অ্যানালিটিক্স'
                  : 'Messaging Volume & Traffic Analytics'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'ইমো, হোয়াটসঅ্যাপ, মেসেঞ্জার ও ইমেলের দৈনিক মেসেজের তুলনামূলক গ্রাফ'
                  : 'Daily message frequency comparison across imo, WhatsApp, Messenger, and Email'}
              </p>
            </div>

            {/* Platform legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>
                <span>হোয়াটসঅ্যাপ</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-400"></span>
                <span>ইমো</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                <span>মেসেঞ্জার</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-400"></span>
                <span>ইমেল</span>
              </div>
            </div>
          </div>

          {/* Pure SVG Bar/Volume Chart */}
          <div className="pt-4">
            <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4 border-b border-slate-800 pb-2">
              {weeklyData.map((item, idx) => {
                const total = item.whatsapp + item.imo + item.messenger + item.email;
                const maxHeight = 850; // normalization
                const waH = (item.whatsapp / maxHeight) * 220;
                const imoH = (item.imo / maxHeight) * 220;
                const msgH = (item.messenger / maxHeight) * 220;
                const mailH = (item.email / maxHeight) * 220;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      {total}
                    </div>
                    {/* Stacked Bars */}
                    <div className="w-full max-w-[38px] flex flex-col-reverse rounded-t-lg overflow-hidden transition-all duration-300 group-hover:brightness-110">
                      <div
                        style={{ height: `${waH}px` }}
                        className="w-full bg-emerald-500"
                        title={`হোয়াটসঅ্যাপ: ${item.whatsapp}`}
                      ></div>
                      <div
                        style={{ height: `${imoH}px` }}
                        className="w-full bg-sky-400"
                        title={`ইমো: ${item.imo}`}
                      ></div>
                      <div
                        style={{ height: `${msgH}px` }}
                        className="w-full bg-blue-500"
                        title={`মেসেঞ্জার: ${item.messenger}`}
                      ></div>
                      <div
                        style={{ height: `${mailH}px` }}
                        className="w-full bg-rose-400"
                        title={`ইমেল: ${item.email}`}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-400">{item.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 px-2">
              <span>{language === 'bn' ? 'সাপ্তাহিক গড়: ৮২০ মেসেজ/দিন' : 'Weekly Avg: 820 msgs/day'}</span>
              <span>{language === 'bn' ? 'সর্বাধিক সক্রিয়: শুক্রবার (ইমো ও হোয়াটসঅ্যাপ)' : 'Peak: Friday (imo & WA)'}</span>
            </div>
          </div>
        </div>

        {/* Platform Share Donut & Breakdown */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              {language === 'bn' ? 'প্ল্যাটফর্ম ব্যবহারের শতকরা হার' : 'Platform Distribution'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn' ? 'কোন মাধ্যমে কত বার্তা আদান-প্রদান হয়েছে' : 'Share of conversations by channel'}
            </p>

            {/* Custom SVG Donut Chart */}
            <div className="relative flex items-center justify-center my-6">
              <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="12" fill="none" />
                {/* WhatsApp: 42% (circumference ~ 238.76) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray="100 138"
                  strokeDashoffset="0"
                  fill="none"
                />
                {/* imo: 30% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#38bdf8"
                  strokeWidth="12"
                  strokeDasharray="72 166"
                  strokeDashoffset="-100"
                  fill="none"
                />
                {/* Messenger: 20% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray="48 190"
                  strokeDashoffset="-172"
                  fill="none"
                />
                {/* Email / SMS: 8% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#fb7185"
                  strokeWidth="12"
                  strokeDasharray="19 219"
                  strokeDashoffset="-220"
                  fill="none"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-100 font-mono">100%</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {language === 'bn' ? 'সংযুক্ত' : 'Synced'}
                </span>
              </div>
            </div>

            {/* Platform Stats List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-300">হোয়াটসঅ্যাপ (WhatsApp)</span>
                </div>
                <span className="font-mono font-bold text-slate-200">42% (6,470)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span className="text-slate-300">ইমো (imo)</span>
                </div>
                <span className="font-mono font-bold text-slate-200">30% (4,620)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-slate-300">ফেসবুক মেসেঞ্জার</span>
                </div>
                <span className="font-mono font-bold text-slate-200">20% (3,080)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  <span className="text-slate-300">ইমেল ও এসএমএস</span>
                </div>
                <span className="font-mono font-bold text-slate-200">8% (1,250)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('messages')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <span>{language === 'bn' ? 'সকল চ্যাট ব্রাউজ করুন' : 'Browse All Chats'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Grid: Quick Shortcuts & Recent Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Communications Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              {language === 'bn' ? 'দ্রুত অ্যাকশন' : 'Quick Actions'}
            </h3>
            <span className="text-[10px] text-emerald-400 font-medium">ফ্রি সেবা</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => setActiveTab('call')}
              className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition group"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-semibold text-slate-200">
                {language === 'bn' ? 'ফ্রি অ্যাপ কল' : 'Free App Call'}
              </div>
              <div className="text-[10px] text-slate-400">
                {language === 'bn' ? 'অডিও ও ভিডিও কল' : 'Audio & Video'}
              </div>
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition group"
            >
              <Search className="w-4 h-4 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-semibold text-slate-200">
                {language === 'bn' ? 'গ্লোবাল সার্চ' : 'Global Search'}
              </div>
              <div className="text-[10px] text-slate-400">
                {language === 'bn' ? 'সব প্ল্যাটফর্মে খুঁজুন' : 'Search all apps'}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('files')}
              className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition group"
            >
              <Share2 className="w-4 h-4 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-semibold text-slate-200">
                {language === 'bn' ? 'ফাইল শেয়ারিং' : 'File Sharing'}
              </div>
              <div className="text-[10px] text-slate-400">
                {language === 'bn' ? 'ছবি ও ডকুমেন্ট' : 'Photos & Docs'}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition group"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-semibold text-slate-200">
                {language === 'bn' ? '2FA ম্যানেজমেন্ট' : '2FA Security'}
              </div>
              <div className="text-[10px] text-slate-400">
                {language === 'bn' ? 'ওটিপি ও সুরক্ষা' : 'OTP & Vault'}
              </div>
            </button>
          </div>
        </div>

        {/* Contacts Safe Vault Preview */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              {language === 'bn' ? 'সুরক্ষিত কন্টাক্টস' : 'Protected Contacts'}
            </h3>
            <button
              onClick={() => setActiveTab('contacts')}
              className="text-xs text-emerald-400 hover:underline"
            >
              {language === 'bn' ? 'সব দেখুন →' : 'View all →'}
            </button>
          </div>
          <div className="space-y-2 pt-1">
            {contacts.slice(0, 3).map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveTab('contacts')}
                className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{c.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{c.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {c.platforms.includes('imo') && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                      imo
                    </span>
                  )}
                  {c.platforms.includes('whatsapp') && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                      WA
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & System Health */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              {language === 'bn' ? 'সাম্প্রতিক সিস্টেম নোটিফিকেশন' : 'System Alerts'}
            </h3>
            <span className="text-[10px] text-slate-400">রিয়েল-টাইম</span>
          </div>
          <div className="space-y-2 pt-1">
            {notifications.slice(0, 3).map((n) => (
              <div
                key={n.id}
                className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 text-[11px] truncate">
                    {n.title}
                  </span>
                  <span className="text-[9px] text-slate-500">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
