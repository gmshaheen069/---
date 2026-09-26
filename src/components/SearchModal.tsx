import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  MessageSquare,
  Users,
  Phone,
  Video,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlatformType } from '../types';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    conversations,
    contacts,
    setSelectedConversationId,
    setActiveTab,
    startCall,
    language,
  } = useApp();

  const [query, setQuery] = useState('');
  const [activePlatformFilter, setActivePlatformFilter] = useState<PlatformType | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Global keydown listener for Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  // Matching messages
  const matchingMessages: {
    convId: string;
    contactName: string;
    contactAvatar: string;
    text: string;
    timestamp: string;
    platform: PlatformType;
  }[] = [];

  if (query.trim()) {
    conversations.forEach((conv) => {
      if (activePlatformFilter !== 'all' && conv.platform !== activePlatformFilter) {
        return;
      }

      conv.messages.forEach((msg) => {
        if (msg.text.toLowerCase().includes(query.toLowerCase())) {
          matchingMessages.push({
            convId: conv.id,
            contactName: conv.contactName,
            contactAvatar: conv.contactAvatar,
            text: msg.text,
            timestamp: msg.timestamp,
            platform: msg.platform,
          });
        }
      });
    });
  }

  // Matching contacts
  const matchingContacts = query.trim()
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.phone.includes(query) ||
          (c.email && c.email.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSelectMessage = (convId: string) => {
    setSelectedConversationId(convId);
    setActiveTab('messages');
    setIsSearchOpen(false);
  };

  const getPlatformName = (p: PlatformType) => {
    switch (p) {
      case 'imo':
        return 'ইমো (imo)';
      case 'whatsapp':
        return 'হোয়াটসঅ্যাপ';
      case 'messenger':
        return 'মেসেঞ্জার';
      case 'email':
        return 'ইমেল';
      case 'sms':
        return 'এসএমএস';
      default:
        return 'অমনিচ্যাট';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'ইমো, হোয়াটসঅ্যাপ, মেসেঞ্জারের যেকোনো বার্তা বা নাম্বার লিখুন...'
                : 'Search any message, imo, WhatsApp, or number...'
            }
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
            ESC
          </kbd>
        </div>

        {/* Platform quick filters */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'সকল প্ল্যাটফর্ম' },
            { id: 'whatsapp', label: 'হোয়াটসঅ্যাপ' },
            { id: 'imo', label: 'ইমো' },
            { id: 'messenger', label: 'মেসেঞ্জার' },
            { id: 'email', label: 'ইমেল' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePlatformFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                activePlatformFilter === tab.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
              <p>
                {language === 'bn'
                  ? 'সার্চ করতে যেকোনো শব্দ, ব্যক্তির নাম বা মোবাইল নাম্বার টাইপ করুন'
                  : 'Type any message keyword, contact name, or phone number to search'}
              </p>
            </div>
          ) : (
            <>
              {/* Matching Contacts */}
              {matchingContacts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>কন্টাক্টস ও মোবাইল নাম্বার ({matchingContacts.length})</span>
                  </h4>
                  <div className="divide-y divide-slate-800/60 bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden">
                    {matchingContacts.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 flex items-center justify-between hover:bg-slate-800/40 transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-200">{c.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{c.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              startCall(c, 'audio');
                              setIsSearchOpen(false);
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-emerald-400 transition"
                            title="Call"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('contacts');
                              setIsSearchOpen(false);
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Messages */}
              {matchingMessages.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>খুঁজে পাওয়া মেসেজসমূহ ({matchingMessages.length})</span>
                  </h4>
                  <div className="divide-y divide-slate-800/60 bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden">
                    {matchingMessages.map((m, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectMessage(m.convId)}
                        className="p-3 hover:bg-slate-800/50 cursor-pointer transition flex items-start gap-3"
                      >
                        <img
                          src={m.contactAvatar}
                          alt={m.contactName}
                          className="w-8 h-8 rounded-full object-cover mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-200">{m.contactName}</span>
                            <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed font-normal bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                            {m.text}
                          </p>
                          <span className="text-[10px] text-emerald-400 font-medium mt-1 inline-block">
                            {getPlatformName(m.platform)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingContacts.length === 0 && matchingMessages.length === 0 && (
                <div className="py-8 text-center text-slate-500">
                  "{query}" দিয়ে কোনো মেসেজ বা কন্টাক্ট পাওয়া যায়নি।
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
