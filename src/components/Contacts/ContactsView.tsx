import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  RefreshCw,
  Phone,
  Video,
  MessageSquare,
  ShieldCheck,
  Download,
  Upload,
  Check,
  Edit2,
  Trash2,
  Lock,
  ExternalLink,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Contact, PlatformType } from '../../types';

export const ContactsView: React.FC = () => {
  const {
    contacts,
    addContact,
    deleteContact,
    restoreContactsFromEmail,
    userEmail,
    setUserEmail,
    isEmailConnected,
    setIsEmailConnected,
    language,
    startCall,
    createOrOpenConversation,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'family' | 'work' | 'friends'>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'whatsapp' | 'imo' | 'messenger'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);

  // New Contact Form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCategory, setNewCategory] = useState<'family' | 'work' | 'friends' | 'other'>('friends');
  const [newNotes, setNewNotes] = useState('');
  const [hasWhatsApp, setHasWhatsApp] = useState(true);
  const [hasImo, setHasImo] = useState(true);
  const [hasMessenger, setHasMessenger] = useState(false);

  // Filtered contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesPlatform = platformFilter === 'all' || c.platforms.includes(platformFilter);

    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const handleRestoreFromEmail = () => {
    const result = restoreContactsFromEmail();
    setRestoreNotice(
      language === 'bn'
        ? `সফলভাবে ${userEmail} থেকে পুরোন ${result.restoredCount}টি ক্লাউড ব্যাকআপ নাম্বার আপনার ফোনবুকে উদ্ধার করা হয়েছে!`
        : `Successfully restored ${result.restoredCount} old backed-up numbers from ${userEmail}!`
    );
    setTimeout(() => setRestoreNotice(null), 5000);
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const platforms: PlatformType[] = ['omnichat'];
    if (hasWhatsApp) platforms.push('whatsapp');
    if (hasImo) platforms.push('imo');
    if (hasMessenger) platforms.push('messenger');

    addContact({
      name: newName,
      phone: newPhone,
      email: newEmail || undefined,
      category: newCategory,
      notes: newNotes || undefined,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      platforms,
    });

    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const exportContactsVCF = () => {
    const vcfData = contacts
      .map(
        (c) => `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nTEL:${c.phone}\nEMAIL:${c.email || ''}\nEND:VCARD`
      )
      .join('\n');
    const blob = new Blob([vcfData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnichat_safe_contacts_${new Date().toISOString().slice(0, 10)}.vcf`;
    a.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Safe Vault & Email Sync */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-100">
              {language === 'bn'
                ? 'মোবাইলের সকল নাম্বার সেফ ভল্ট ও ইমেল রিস্টোর'
                : 'Safe Contacts Vault & Email Cloud Restore'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'আপনার সকল ফোন নাম্বার ক্লাউডে 256-bit এনক্রিপশনে সুরক্ষিত থাকবে। যেকোনো সময় ইমেল কানেক্ট করে পুরোন সকল নাম্বার এক ক্লিকে পুনরুদ্ধার করুন।'
              : 'All your phone numbers are safely stored with 256-bit encryption. Connect your email anytime to restore previous contacts instantly.'}
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
            <span className="text-slate-400">
              {language === 'bn' ? 'সংযুক্ত ইমেল:' : 'Connected Email:'}
            </span>
            <span className="font-semibold text-sky-400 font-mono">{userEmail}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="text-[11px] text-slate-400 hover:text-white underline ml-1"
            >
              {language === 'bn' ? 'ইমেল পরিবর্তন' : 'Change email'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={handleRestoreFromEmail}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/20 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>
              {language === 'bn'
                ? 'ইমেল দিয়ে পুরোন নাম্বার আনুন'
                : 'Restore Old Numbers via Email'}
            </span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন নাম্বার যোগ করুন' : 'Add Contact'}</span>
          </button>

          <button
            onClick={exportContactsVCF}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title={language === 'bn' ? 'সব নাম্বার VCF ফাইলে ব্যাকআপ ডাউনলোড করুন' : 'Download VCF file'}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Restore Notice Toast */}
      {restoreNotice && (
        <div className="p-4 rounded-2xl bg-sky-950/80 border border-sky-700/60 text-sky-200 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 text-sky-400" />
            <span>{restoreNotice}</span>
          </div>
          <button
            onClick={() => setRestoreNotice(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'নাম, মোবাইল নাম্বার বা ইমেল দিয়ে খুঁজুন...'
                : 'Search by name, phone or email...'
            }
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Categories & App presence filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['all', 'family', 'work', 'friends'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all'
                  ? language === 'bn'
                    ? 'সকল'
                    : 'All'
                  : cat === 'family'
                  ? language === 'bn'
                    ? 'পরিবার'
                    : 'Family'
                  : cat === 'work'
                  ? language === 'bn'
                    ? 'অফিস'
                    : 'Work'
                  : language === 'bn'
                  ? 'বন্ধু'
                  : 'Friends'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['all', 'imo', 'whatsapp', 'messenger'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  platformFilter === p
                    ? 'bg-slate-800 text-sky-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p === 'all' ? (language === 'bn' ? 'সব অ্যাপ' : 'All Apps') : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700 shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{contact.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{contact.phone}</p>
                    {contact.email && (
                      <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                        {contact.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      contact.category === 'family'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        : contact.category === 'work'
                        ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                    }`}
                  >
                    {contact.category === 'family'
                      ? 'পরিবার'
                      : contact.category === 'work'
                      ? 'অফিস'
                      : 'বন্ধু'}
                  </span>
                </div>
              </div>

              {/* Note / Tag */}
              {contact.notes && (
                <p className="text-xs text-slate-400 bg-slate-950/50 p-2 rounded-xl mb-3 border border-slate-800/60 line-clamp-2">
                  📌 {contact.notes}
                </p>
              )}

              {/* App Availability badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {contact.platforms.map((pl) => (
                  <span
                    key={pl}
                    className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium ${
                      pl === 'imo'
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                        : pl === 'whatsapp'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : pl === 'messenger'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                    }`}
                  >
                    {pl === 'imo'
                      ? 'ইমো'
                      : pl === 'whatsapp'
                      ? 'হোয়াটসঅ্যাপ'
                      : pl === 'messenger'
                      ? 'মেসেঞ্জার'
                      : 'অমনিচ্যাট'}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => createOrOpenConversation(contact)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-emerald-400 transition"
                  title={language === 'bn' ? 'মেসেজ পাঠান' : 'Send message'}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => startCall(contact, 'audio')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-emerald-400 transition"
                  title={language === 'bn' ? 'ফ্রি অডিও কল' : 'Audio Call'}
                >
                  <Phone className="w-4 h-4" />
                </button>

                <button
                  onClick={() => startCall(contact, 'video')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-sky-600 hover:text-white text-sky-400 transition"
                  title={language === 'bn' ? 'ফ্রি ভিডিও কল' : 'Video Call'}
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-500 transition"
                  title={language === 'bn' ? 'ডিলিট করুন' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-slate-100 text-base">
                  {language === 'bn' ? 'নতুন নাম্বার যোগ ও সেফ ভল্ট' : 'Add New Safe Contact'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: জামাল উদ্দিন"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {language === 'bn' ? 'মোবাইল নাম্বার' : 'Phone Number'} *
                </label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+880 1712-000000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {language === 'bn' ? 'ইমেল (ঐচ্ছিক)' : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="friends">{language === 'bn' ? 'বন্ধু' : 'Friends'}</option>
                  <option value="family">{language === 'bn' ? 'পরিবার' : 'Family'}</option>
                  <option value="work">{language === 'bn' ? 'অফিস / ব্যবসা' : 'Work'}</option>
                  <option value="other">{language === 'bn' ? 'অন্যান্য' : 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">
                  {language === 'bn' ? 'কোন কোন অ্যাপ আছে?' : 'Available Apps'}
                </label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasWhatsApp}
                      onChange={(e) => setHasWhatsApp(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-emerald-500"
                    />
                    <span className="text-emerald-400">হোয়াটসঅ্যাপ</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasImo}
                      onChange={(e) => setHasImo(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-sky-500"
                    />
                    <span className="text-sky-400">ইমো (imo)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasMessenger}
                      onChange={(e) => setHasMessenger(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-blue-500"
                    />
                    <span className="text-blue-400">মেসেঞ্জার</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {language === 'bn' ? 'নোট বা মন্তব্য' : 'Notes'}
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="যেমন: গ্রামের বাড়ি, জরুরি নম্বর"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
                >
                  {language === 'bn' ? 'সেভ ও ক্লাউড সিঙ্ক' : 'Save & Sync'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-slate-100 text-base">
                  {language === 'bn' ? 'কানেক্টেড ইমেল অ্যাকাউন্ট' : 'Connected Email Account'}
                </h3>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <p className="text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'এই ইমেল দিয়ে কানেক্ট করলেই ক্লাউডে ব্যাকআপ থাকা সকল পুরোন নাম্বার ও হিস্ট্রি স্বয়ংক্রিয়ভাবে ফিরে আসবে।'
                  : 'Connecting this email automatically restores all historical numbers and cloud archives.'}
              </p>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">ইমেল এড্রেস</label>
                <input
                  type="email"
                  defaultValue={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-400 font-medium">ক্লাউড সিঙ্ক অ্যাক্টিভ ও সুরক্ষিত</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs"
              >
                {language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
