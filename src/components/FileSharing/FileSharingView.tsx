import React, { useState, useRef } from 'react';
import {
  Share2,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Music,
  Archive,
  Download,
  Trash2,
  Send,
  Check,
  Search,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SharedFileItem, PlatformType } from '../../types';

export const FileSharingView: React.FC = () => {
  const {
    sharedFiles,
    uploadFile,
    deleteSharedFile,
    contacts,
    createOrOpenConversation,
    language,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'pdf' | 'audio' | 'archive'>('all');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedContactForShare, setSelectedContactForShare] = useState<string>(contacts[0]?.id || '');
  const [shareSuccessToast, setShareSuccessToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = sharedFiles.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.sharedWith.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || f.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let type: 'image' | 'pdf' | 'audio' | 'archive' | 'doc' = 'doc';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.includes('pdf')) type = 'pdf';
      else if (file.type.startsWith('audio/')) type = 'audio';
      else if (file.name.endsWith('.zip') || file.name.endsWith('.enc')) type = 'archive';

      const targetContact = contacts.find((c) => c.id === selectedContactForShare)?.name || 'কন্টাক্ট';

      uploadFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type,
        sharedWith: targetContact,
        platform: 'omnichat',
      });
    }

    setShareSuccessToast(true);
    setTimeout(() => setShareSuccessToast(false), 3000);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-sky-400" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'audio':
        return <Music className="w-5 h-5 text-emerald-400" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-amber-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-slate-100">
              {language === 'bn'
                ? 'হাই-স্পিড ফাইল শেয়ারিং ও ডকুমেন্ট হাব'
                : 'High-Speed File Sharing Hub'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'ইমো, হোয়াটসঅ্যাপ এবং অ্যাপ-টু-অ্যাপ মাধ্যমে যেকোনো ছবি, পিডিএফ, অডিও বা বড় আকারের ডকুমেন্ট দ্রুত আদান-প্রদান করুন।'
              : 'Share photos, PDFs, voice audio, and encrypted archives with contacts effortlessly.'}
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{language === 'bn' ? 'ফাইল আপলোড ও শেয়ার' : 'Upload & Share'}</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone & Contact Target */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`md:col-span-2 p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-950/20'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-200 text-sm">
            {language === 'bn'
              ? 'ফাইল ড্র্যাগ করে এখানে ছাড়ুন অথবা ক্লিক করে আপলোড করুন'
              : 'Drag & drop files here or click to browse'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'সমর্থিত ফরম্যাট: ছবি (JPG, PNG), পিডিএফ (PDF), অডিও ও জিপ আর্কাইভ (সর্বোচ্চ ১০০ মেগাবাইট)'
              : 'Supports Images, PDFs, Audio, and Archives up to 100MB'}
          </p>
        </div>

        {/* Share Target Contact Box */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              {language === 'bn' ? 'ফাইল কার সাথে শেয়ার করবেন?' : 'Share With Contact'}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {language === 'bn'
                ? 'সিলেক্টেড কন্টাক্টের মেসেঞ্জার, হোয়াটসঅ্যাপ বা ইমোতে ফাইল যাবে'
                : 'Directly sends into recipient chat thread'}
            </p>
            <select
              value={selectedContactForShare}
              onChange={(e) => setSelectedContactForShare(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
            {language === 'bn'
              ? '🔒 ফাইল সরাসরি অ্যান্ড-টু-অ্যান্ড এনক্রিপশনে সেন্ট হবে।'
              : '🔒 Sent directly via end-to-end encryption.'}
          </div>
        </div>
      </div>

      {/* Share Toast */}
      {shareSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 flex items-center gap-2.5 text-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>ফাইল সফলভাবে আপলোড ও কন্টাক্টের সাথে শেয়ার করা হয়েছে!</span>
        </div>
      )}

      {/* Files Catalog Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              {language === 'bn' ? 'শেয়ার করা ফাইল ও ডকুমেন্টস' : 'Shared Files & Media'}
            </h2>
            <p className="text-xs text-slate-400">
              {sharedFiles.length} টি ফাইল বর্তমানে সংরক্ষিত
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ফাইল খুঁজুন..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['all', 'image', 'pdf', 'audio', 'archive'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    selectedType === t
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'all'
                    ? 'সব'
                    : t === 'image'
                    ? 'ছবি'
                    : t === 'pdf'
                    ? 'পিডিএফ'
                    : t === 'audio'
                    ? 'ভয়েস'
                    : 'জিপ'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/20 px-2 rounded-2xl transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-200 text-xs truncate max-w-sm">
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-mono">{file.size}</span>
                    <span>·</span>
                    <span>শেয়ার করা হয়েছে: {file.sharedWith}</span>
                    <span>·</span>
                    <span className="text-slate-500">{file.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => {
                    const blob = new Blob([file.name], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name;
                    a.click();
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteSharedFile(file.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-500 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
