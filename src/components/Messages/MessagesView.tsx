import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Pin,
  CheckCheck,
  Check,
  Paperclip,
  Mic,
  Send,
  Phone,
  Video,
  MoreVertical,
  Smile,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Shield,
  Clock,
  Sparkles,
  X,
  Play,
  Pause,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlatformType, Message } from '../../types';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    sendMessage,
    togglePinConversation,
    markConversationAsRead,
    language,
    startCall,
    contacts,
  } = useApp();

  const [platformFilter, setPlatformFilter] = useState<PlatformType | 'all'>('all');
  const [filterSearch, setFilterSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [activeAudioPlaying, setActiveAudioPlaying] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Selected conversation
  const currentConversation =
    conversations.find((c) => c.id === selectedConversationId) || conversations[0];

  // Associated contact
  const currentContact = contacts.find((c) => c.id === currentConversation?.contactId) || {
    id: currentConversation?.contactId || 'unknown',
    name: currentConversation?.contactName || 'অপরিচিত',
    phone: currentConversation?.contactNumber || '',
    avatar: currentConversation?.contactAvatar || '',
    category: 'other' as const,
    platforms: currentConversation?.availablePlatforms || ['whatsapp'],
    lastSynced: 'আজ',
    isBackedUp: true,
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesPlatform = platformFilter === 'all' || c.platform === platformFilter;
    const matchesSearch =
      c.contactName.toLowerCase().includes(filterSearch.toLowerCase()) ||
      c.contactNumber.includes(filterSearch) ||
      c.lastMessage.toLowerCase().includes(filterSearch.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  // Voice recording simulation
  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleSend = () => {
    if (!replyText.trim() || !currentConversation) return;
    sendMessage(currentConversation.id, replyText);
    setReplyText('');
  };

  const handleSendVoiceNote = () => {
    if (!currentConversation) return;
    setIsRecordingVoice(false);
    sendMessage(currentConversation.id, 'ভয়েস মেসেজ (Voice Note 0:15)', [
      {
        id: `voice-${Date.now()}`,
        name: `voice_note_${new Date().toLocaleTimeString()}.m4a`,
        size: '240 KB',
        type: 'audio',
      },
    ]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentConversation) {
      const isImg = file.type.startsWith('image/');
      sendMessage(currentConversation.id, file.name, [
        {
          id: `file-${Date.now()}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          type: isImg ? 'image' : 'file',
          url: isImg ? URL.createObjectURL(file) : undefined,
        },
      ]);
      setShowAttachmentMenu(false);
    }
  };

  const getPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'imo':
        return {
          name: 'ইমো (imo)',
          short: 'imo',
          bgColor: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
          dotColor: 'bg-sky-400',
        };
      case 'whatsapp':
        return {
          name: 'হোয়াটসঅ্যাপ',
          short: 'WhatsApp',
          bgColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          dotColor: 'bg-emerald-400',
        };
      case 'messenger':
        return {
          name: 'মেসেঞ্জার',
          short: 'Messenger',
          bgColor: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
          dotColor: 'bg-blue-400',
        };
      case 'email':
        return {
          name: 'ইমেল',
          short: 'Email',
          bgColor: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          dotColor: 'bg-rose-400',
        };
      case 'sms':
        return {
          name: 'এসএমএস',
          short: 'SMS',
          bgColor: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
          dotColor: 'bg-indigo-400',
        };
      default:
        return {
          name: 'অমনিচ্যাট ফ্রি',
          short: 'OmniChat',
          bgColor: 'bg-teal-500/15 border-teal-500/30 text-teal-400',
          dotColor: 'bg-teal-400',
        };
    }
  };

  const quickRepliesList = [
    'আসসালামু আলাইকুম! কেমন আছেন?',
    'আমি একটু ব্যস্ত আছি, কিছুক্ষণ পর কল করছি।',
    'ফাইলটি পেয়েছি, ধন্যবাদ!',
    'ঠিক আছে, ইনশাআল্লাহ কথা হবে।',
    'ইমোতে একটা অডিও কল দেন।',
    'হোয়াটসঅ্যাপে লোকেশন পাঠিয়ে দিয়েছি।',
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-slate-950">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Conversations Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-800/80 bg-slate-900/60 flex flex-col shrink-0">
        {/* Search Bar & Filter Header */}
        <div className="p-3 border-b border-slate-800 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'নাম, নাম্বার বা মেসেজ দিয়ে খুঁজুন...'
                  : 'Search names, numbers, messages...'
              }
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            {filterSearch && (
              <button
                onClick={() => setFilterSearch('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Platform Segmented Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: language === 'bn' ? 'সকল' : 'All' },
              { id: 'whatsapp', label: 'হোয়াটসঅ্যাপ' },
              { id: 'imo', label: 'ইমো' },
              { id: 'messenger', label: 'মেসেঞ্জার' },
              { id: 'email', label: 'ইমেল' },
              { id: 'sms', label: 'এসএমএস' },
              { id: 'omnichat', label: 'ফ্রি চ্যাট' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPlatformFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  platformFilter === tab.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              {language === 'bn'
                ? 'কোনো মেসেজ পাওয়া যায়নি'
                : 'No conversations found'}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedConversationId;
              const badge = getPlatformBadge(conv.platform);

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversationId(conv.id);
                    markConversationAsRead(conv.id);
                  }}
                  className={`p-3 cursor-pointer transition flex items-start gap-3 relative ${
                    isSelected
                      ? 'bg-slate-800/70 border-l-4 border-l-emerald-500'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.contactAvatar}
                      alt={conv.contactName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                    />
                    {/* Platform tiny badge overlay */}
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-slate-900 ${badge.dotColor}`}
                      title={badge.name}
                    >
                      {badge.short.slice(0, 1)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-semibold text-slate-200 text-xs truncate flex items-center gap-1.5">
                        {conv.contactName}
                        {conv.isPinned && <Pin className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 truncate mb-1">
                      {conv.lastMessage}
                    </p>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${badge.bgColor}`}
                      >
                        {badge.name}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Thread */}
      {currentConversation ? (
        <div className="flex-1 flex flex-col h-full bg-slate-950/80">
          {/* Chat Header */}
          <div className="p-3.5 sm:px-6 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentConversation.contactAvatar}
                alt={currentConversation.contactName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-100 text-sm">
                    {currentConversation.contactName}
                  </h2>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                      getPlatformBadge(currentConversation.platform).bgColor
                    }`}
                  >
                    {getPlatformBadge(currentConversation.platform).name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {currentConversation.contactNumber}
                </p>
              </div>
            </div>

            {/* Quick Calling & Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => startCall(currentContact, 'audio')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-emerald-400 transition"
                title={language === 'bn' ? 'ফ্রি অডিও কল করুন' : 'Free Voice Call'}
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => startCall(currentContact, 'video')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-sky-600 hover:text-white text-sky-400 transition"
                title={language === 'bn' ? 'ফ্রি ভিডিও কল করুন' : 'Free Video Call'}
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => togglePinConversation(currentConversation.id)}
                className={`p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition ${
                  currentConversation.isPinned ? 'text-amber-400' : 'text-slate-400'
                }`}
                title={language === 'bn' ? 'পিন চ্যাট' : 'Pin chat'}
              >
                <Pin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Encryption notice */}
            <div className="flex justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-medium">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>
                  {language === 'bn'
                    ? 'এন্ড-টু-এন্ড এনক্রিপশন ও ব্যাকআপ সুরক্ষিত'
                    : 'End-to-end encrypted & backed up'}
                </span>
              </div>
            </div>

            {currentConversation.messages.map((msg) => {
              const badge = getPlatformBadge(msg.platform);
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md rounded-2xl p-3.5 text-xs sm:text-sm shadow-md ${
                      msg.isMe
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/60'
                    }`}
                  >
                    {/* Sender label if in group or foreign */}
                    {!msg.isMe && (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold mb-1">
                        <span>{msg.senderName}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400 font-normal">{badge.short}</span>
                      </div>
                    )}

                    {/* Text Body */}
                    <p className="leading-relaxed break-words">{msg.text}</p>

                    {/* Attachments rendering */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.attachments.map((att) => (
                          <div key={att.id}>
                            {att.type === 'image' && att.url ? (
                              <div className="rounded-xl overflow-hidden border border-white/20">
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="w-full max-h-56 object-cover"
                                />
                              </div>
                            ) : att.type === 'audio' ? (
                              <div className="flex items-center gap-3 p-2 rounded-xl bg-black/20 border border-white/10">
                                <button
                                  onClick={() =>
                                    setActiveAudioPlaying(
                                      activeAudioPlaying === att.id ? null : att.id
                                    )
                                  }
                                  className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
                                >
                                  {activeAudioPlaying === att.id ? (
                                    <Pause className="w-3.5 h-3.5" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 ml-0.5" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full bg-white rounded-full ${
                                        activeAudioPlaying === att.id
                                          ? 'w-3/4 transition-all duration-1000'
                                          : 'w-1/4'
                                      }`}
                                    ></div>
                                  </div>
                                  <div className="flex justify-between text-[9px] text-white/70 mt-1">
                                    <span>{att.name}</span>
                                    <span>{att.size}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/20 border border-white/10 text-xs">
                                <FileText className="w-4 h-4 shrink-0" />
                                <div className="flex-1 truncate">
                                  <p className="font-semibold truncate">{att.name}</p>
                                  <span className="text-[10px] opacity-75">{att.size}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timestamp & Status checks */}
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        msg.isMe ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.isMe && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
                          ) : msg.status === 'delivered' ? (
                            <CheckCheck className="w-3.5 h-3.5 opacity-80" />
                          ) : (
                            <Check className="w-3.5 h-3.5 opacity-80" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Picker Dropdown */}
          {showQuickReplies && (
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-full flex items-center justify-between mb-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {language === 'bn' ? 'দ্রুত উত্তর টেমপ্লেট' : 'Quick Responses'}
                </span>
                <button
                  onClick={() => setShowQuickReplies(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {quickRepliesList.map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setReplyText(phrase);
                    setShowQuickReplies(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950/60 hover:border-emerald-700/60 border border-slate-700 text-xs text-slate-200 transition text-left"
                >
                  {phrase}
                </button>
              ))}
            </div>
          )}

          {/* Input & Action Bar */}
          <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 relative">
            {/* Voice note recording preview */}
            {isRecordingVoice ? (
              <div className="flex items-center justify-between bg-red-950/40 border border-red-800/60 rounded-2xl px-4 py-2.5 animate-pulse">
                <div className="flex items-center gap-3 text-red-400 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>
                    {language === 'bn' ? 'ভয়েস রেকর্ড হচ্ছে...' : 'Recording audio...'} (00:
                    {recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRecordingVoice(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleSendVoiceNote}
                    className="px-4 py-1.5 rounded-xl bg-red-500 text-white font-semibold text-xs"
                  >
                    {language === 'bn' ? 'পাঠান' : 'Send'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Attachment Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  title={language === 'bn' ? 'ফাইল / ছবি সংযুক্ত করুন' : 'Attach File'}
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Quick Templates Trigger */}
                <button
                  onClick={() => setShowQuickReplies(!showQuickReplies)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition hidden sm:block"
                  title={language === 'bn' ? 'দ্রুত টেক্সট' : 'Quick text'}
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                {/* Message input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={
                      language === 'bn'
                        ? `${getPlatformBadge(currentConversation.platform).name}-এ মেসেজ লিখুন...`
                        : `Write a message on ${getPlatformBadge(currentConversation.platform).short}...`
                    }
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Voice Note Button */}
                <button
                  onClick={() => setIsRecordingVoice(true)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
                  title={language === 'bn' ? 'ভয়েস মেসেজ রেকর্ড করুন' : 'Voice Message'}
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={!replyText.trim()}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-slate-950 font-bold transition shadow-lg shadow-emerald-600/20"
                  title={language === 'bn' ? 'মেসেজ পাঠান' : 'Send'}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          {language === 'bn'
            ? 'কথোপকথন শুরু করতে একটি চ্যাট নির্বাচন করুন'
            : 'Select a conversation to start chatting'}
        </div>
      )}
    </div>
  );
};
