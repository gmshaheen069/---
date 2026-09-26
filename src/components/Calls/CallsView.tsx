import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  PhoneCall,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Users,
  MessageSquare,
  Shield,
  Sparkles,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Contact } from '../../types';

export const CallsView: React.FC = () => {
  const {
    contacts,
    activeCall,
    startCall,
    endCall,
    toggleCallMute,
    toggleCallVideo,
    toggleCallSpeaker,
    createOrOpenConversation,
    language,
  } = useApp();

  const [searchContact, setSearchContact] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Filter contacts who support OmniChat or direct calling
  const callableContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchContact.toLowerCase()) ||
      c.phone.includes(searchContact)
  );

  // Camera stream handler for video call
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (activeCall.isActive && activeCall.type === 'video' && !activeCall.isVideoOff) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          setCameraStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Camera permission denied or not supported in frame - fallback gracefully
          setCameraStream(null);
        });
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeCall.isActive, activeCall.type, activeCall.isVideoOff]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Active Call Modal Overlay */}
      {activeCall.isActive && activeCall.contact && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-between min-h-[500px] relative overflow-hidden">
            {/* Call Header */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400 z-10">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Shield className="w-4 h-4" />
                <span>{language === 'bn' ? 'ফ্রি এন্ড-টু-এন্ড এনক্রিপ্টেড কল' : 'Free Encrypted Call'}</span>
              </div>
              <span className="font-mono text-sm text-slate-200">
                {activeCall.status === 'connected'
                  ? formatDuration(activeCall.durationSeconds)
                  : language === 'bn'
                  ? 'রিং হচ্ছে...'
                  : 'Ringing...'}
              </span>
            </div>

            {/* Video or Avatar Display */}
            <div className="w-full my-6 flex flex-col items-center justify-center flex-1 z-10">
              {activeCall.type === 'video' && !activeCall.isVideoOff ? (
                <div className="w-full h-64 sm:h-72 bg-black rounded-2xl overflow-hidden relative border border-slate-700">
                  {cameraStream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-3 bg-gradient-to-b from-slate-800 to-slate-900">
                      <img
                        src={activeCall.contact.avatar}
                        alt={activeCall.contact.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
                      />
                      <p className="text-xs text-slate-300">
                        {activeCall.contact.name} এর সাথে এইচডি ভিডিও সংযোগ চালু
                      </p>
                    </div>
                  )}

                  {/* Remote user picture in picture */}
                  <div className="absolute top-3 right-3 w-24 h-28 bg-slate-800 rounded-xl overflow-hidden border border-slate-600 shadow-lg flex flex-col items-center justify-center p-1">
                    <img
                      src={activeCall.contact.avatar}
                      alt="Remote"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="text-[10px] text-slate-200 truncate mt-1">
                      {activeCall.contact.name}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img
                      src={activeCall.contact.avatar}
                      alt={activeCall.contact.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-emerald-500/80 shadow-2xl"
                    />
                    {activeCall.status === 'connected' && (
                      <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-900 animate-pulse"></span>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-100">{activeCall.contact.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{activeCall.contact.phone}</p>
                    <p className="text-xs text-emerald-400 font-medium mt-1">
                      {activeCall.status === 'connected'
                        ? language === 'bn'
                          ? 'এইচডি ভয়েস সংযুক্ত'
                          : 'HD Voice Connected'
                        : language === 'bn'
                        ? 'কল দেওয়া হচ্ছে...'
                        : 'Calling...'}
                    </p>
                  </div>

                  {/* Audio Wave Visualizer Animation */}
                  {activeCall.status === 'connected' && (
                    <div className="flex items-center gap-1 h-8 pt-2">
                      {[12, 24, 16, 32, 20, 28, 14, 26, 18].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}px` }}
                          className="w-1 bg-emerald-400 rounded-full animate-pulse"
                        ></span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* In-Call Controls */}
            <div className="w-full flex items-center justify-center gap-4 pt-4 border-t border-slate-800 z-10">
              {/* Mute Mic */}
              <button
                onClick={toggleCallMute}
                className={`p-3.5 rounded-full transition ${
                  activeCall.isMuted
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title="Mute"
              >
                {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Video On/Off */}
              {activeCall.type === 'video' && (
                <button
                  onClick={toggleCallVideo}
                  className={`p-3.5 rounded-full transition ${
                    activeCall.isVideoOff
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                  title="Camera"
                >
                  {activeCall.isVideoOff ? (
                    <VideoOff className="w-5 h-5" />
                  ) : (
                    <Video className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Speaker */}
              <button
                onClick={toggleCallSpeaker}
                className={`p-3.5 rounded-full transition ${
                  !activeCall.isSpeakerOn
                    ? 'bg-slate-700 text-slate-400'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title="Speaker"
              >
                {activeCall.isSpeakerOn ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </button>

              {/* End Call */}
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30 transition transform hover:scale-105"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-100">
              {language === 'bn'
                ? 'ফ্রি চ্যাটিং ও আনলিমিটেড কলিং হাব'
                : 'Free Peer-to-Peer Calling & Chat'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'যারা যারা এই অ্যাপ ব্যবহার করছেন, তাদের সাথে সম্পূর্ণ ফ্রিতে কথা বলুন এবং ক্রিস্টাল ক্লিয়ার এইচডি ভিডিও কল করুন। কোনো ব্যালেন্স কাটার ঝামেলা নেই।'
              : 'Unlimited free voice & video calls and instant chat between all users of the applet. Free and end-to-end encrypted.'}
          </p>
        </div>

        <div className="flex items-center gap-2 z-10">
          <span className="px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 font-semibold text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {language === 'bn' ? 'ফ্রি কলিং নেটওয়ার্ক সক্রিয়' : 'Free Calling Network Online'}
          </span>
        </div>
      </div>

      {/* Search contacts for calling */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchContact}
          onChange={(e) => setSearchContact(e.target.value)}
          placeholder={
            language === 'bn'
              ? 'কাকে কল করতে চান? নাম বা নাম্বার লিখুন...'
              : 'Search who to call...'
          }
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>

      {/* Contact Cards for Calling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {callableContacts.map((contact) => (
          <div
            key={contact.id}
            className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-slate-200 text-xs truncate">{contact.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono truncate">{contact.phone}</p>
                <span className="text-[10px] text-emerald-400 font-medium">OmniChat ফ্রি সক্রিয়</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => createOrOpenConversation(contact, 'omnichat')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                onClick={() => startCall(contact, 'audio')}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-600/20 transition"
                title="Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => startCall(contact, 'video')}
                className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-600/20 transition"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
