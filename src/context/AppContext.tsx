import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Conversation,
  Contact,
  NotificationItem,
  BackupRecord,
  SecuritySession,
  AppUpdateDetails,
  CallSession,
  SharedFileItem,
  PlatformType,
  Message,
} from '../types';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_CONTACTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BACKUPS,
  INITIAL_SECURITY_SESSIONS,
  INITIAL_FILES,
  APP_UPDATE_INFO,
  ARCHIVED_EMAIL_CONTACTS,
} from '../data/mockData';

interface AppContextType {
  // Navigation & Search
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;

  // Conversations & Messages
  conversations: Conversation[];
  sendMessage: (conversationId: string, text: string, attachments?: any[]) => void;
  createOrOpenConversation: (contact: Contact, platform?: PlatformType) => string;
  markConversationAsRead: (conversationId: string) => void;
  togglePinConversation: (conversationId: string) => void;

  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'lastSynced' | 'isBackedUp'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  restoreContactsFromEmail: () => { restoredCount: number };

  // Email Connection
  userEmail: string;
  setUserEmail: (email: string) => void;
  isEmailConnected: boolean;
  setIsEmailConnected: (connected: boolean) => void;
  lastEmailSyncTime: string;

  // Security & 2FA
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
  twoFactorMethod: 'email' | 'sms' | 'authenticator';
  setTwoFactorMethod: (method: 'email' | 'sms' | 'authenticator') => void;
  appPinEnabled: boolean;
  setAppPinEnabled: (enabled: boolean) => void;
  isAppLocked: boolean;
  setIsAppLocked: (locked: boolean) => void;
  securitySessions: SecuritySession[];

  // Cloud Sync & Backup
  backups: BackupRecord[];
  isBackingUp: boolean;
  createCloudBackup: () => Promise<void>;
  restoreBackup: (backupId: string) => void;
  autoSyncEnabled: boolean;
  setAutoSyncEnabled: (enabled: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // File Sharing
  sharedFiles: SharedFileItem[];
  uploadFile: (file: Omit<SharedFileItem, 'id' | 'uploadedAt'>) => void;
  deleteSharedFile: (id: string) => void;

  // App Updates
  appUpdate: AppUpdateDetails;
  isCheckingUpdate: boolean;
  checkForUpdates: () => Promise<boolean>;
  toggleAutoCheckUpdates: () => void;

  // Audio/Video Calling
  activeCall: CallSession;
  startCall: (contact: Contact, type: 'audio' | 'video') => void;
  endCall: () => void;
  toggleCallMute: () => void;
  toggleCallVideo: () => void;
  toggleCallSpeaker: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('conv-1');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  // Load state from LocalStorage or mock data
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('omnichat_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('omnichat_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [userEmail, setUserEmail] = useState<string>('gmshaheen069@gmail.com');
  const [isEmailConnected, setIsEmailConnected] = useState<boolean>(true);
  const [lastEmailSyncTime, setLastEmailSyncTime] = useState<string>('আজ দুপুর ১২:০০');

  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'email' | 'sms' | 'authenticator'>('email');
  const [appPinEnabled, setAppPinEnabled] = useState<boolean>(false);
  const [isAppLocked, setIsAppLocked] = useState<boolean>(false);
  const [securitySessions] = useState<SecuritySession[]>(INITIAL_SECURITY_SESSIONS);

  const [backups, setBackups] = useState<BackupRecord[]>(() => {
    const saved = localStorage.getItem('omnichat_backups');
    return saved ? JSON.parse(saved) : INITIAL_BACKUPS;
  });
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('omnichat_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [sharedFiles, setSharedFiles] = useState<SharedFileItem[]>(() => {
    const saved = localStorage.getItem('omnichat_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [appUpdate, setAppUpdate] = useState<AppUpdateDetails>(APP_UPDATE_INFO);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);

  // Calling state
  const [activeCall, setActiveCall] = useState<CallSession>({
    isActive: false,
    type: 'audio',
    status: 'ended',
    durationSeconds: 0,
    isMuted: false,
    isVideoOff: false,
    isSpeakerOn: true,
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('omnichat_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('omnichat_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('omnichat_backups', JSON.stringify(backups));
  }, [backups]);

  useEffect(() => {
    localStorage.setItem('omnichat_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('omnichat_files', JSON.stringify(sharedFiles));
  }, [sharedFiles]);

  // Call timer interval
  useEffect(() => {
    let timer: any;
    if (activeCall.isActive && activeCall.status === 'connected') {
      timer = setInterval(() => {
        setActiveCall((prev) => ({
          ...prev,
          durationSeconds: prev.durationSeconds + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall.isActive, activeCall.status]);

  // Messages operations
  const sendMessage = (conversationId: string, text: string, attachments?: any[]) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'আমি',
      text,
      timestamp: timeString,
      isMe: true,
      platform: 'omnichat',
      status: 'sent',
      attachments,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: text || (attachments ? 'ফাইল পাঠানো হয়েছে' : ''),
            lastMessageTime: timeString,
            messages: [...conv.messages, { ...newMsg, platform: conv.platform }],
          };
        }
        return conv;
      })
    );

    // If sent with attachment, record in sharedFiles
    if (attachments && attachments.length > 0) {
      attachments.forEach((att) => {
        uploadFile({
          name: att.name,
          size: att.size || '1.5 MB',
          type: att.type || 'file',
          sharedWith: conversations.find((c) => c.id === conversationId)?.contactName || 'কন্টাক্ট',
          platform: conversations.find((c) => c.id === conversationId)?.platform || 'omnichat',
        });
      });
    }

    // Simulate automatic delivery & reply if desired
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: conv.messages.map((m) =>
                m.id === newMsg.id ? { ...m, status: 'delivered' } : m
              ),
            };
          }
          return conv;
        })
      );
    }, 1200);
  };

  const createOrOpenConversation = (contact: Contact, platform?: PlatformType): string => {
    const targetPlatform = platform || contact.platforms[0] || 'omnichat';
    const existing = conversations.find(
      (c) => c.contactId === contact.id && (platform ? c.platform === platform : true)
    );

    if (existing) {
      setSelectedConversationId(existing.id);
      setActiveTab('messages');
      return existing.id;
    }

    const newConvId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      contactId: contact.id,
      contactName: contact.name,
      contactNumber: contact.phone,
      contactEmail: contact.email,
      contactAvatar: contact.avatar,
      lastMessage: 'নতুন চ্যাট শুরু করা হয়েছে',
      lastMessageTime: 'এইমাত্র',
      unreadCount: 0,
      platform: targetPlatform,
      availablePlatforms: contact.platforms,
      messages: [
        {
          id: `m-init-${Date.now()}`,
          senderId: 'system',
          senderName: 'সিস্টেম',
          text: `${contact.name} এর সাথে এনক্রিপ্টেড সংযোগ স্থাপিত হয়েছে।`,
          timestamp: 'এইমাত্র',
          isMe: false,
          platform: targetPlatform,
          status: 'read',
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setSelectedConversationId(newConvId);
    setActiveTab('messages');
    return newConvId;
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv))
    );
  };

  const togglePinConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
      )
    );
  };

  // Contacts
  const addContact = (newContactData: Omit<Contact, 'id' | 'lastSynced' | 'isBackedUp'>) => {
    const newContact: Contact = {
      ...newContactData,
      id: `c-${Date.now()}`,
      lastSynced: 'এইমাত্র',
      isBackedUp: true,
    };
    setContacts((prev) => [newContact, ...prev]);

    // Push notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'নতুন কন্টাক্ট সেভ হয়েছে',
        message: `${newContact.name} ক্লাউড ভল্টে নিরাপদে সংরক্ষিত হয়েছে।`,
        time: 'এইমাত্র',
        type: 'backup',
        isRead: false,
      },
      ...prev,
    ]);
  };

  const updateContact = (id: string, updatedFields: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields, lastSynced: 'এইমাত্র' } : c))
    );
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const restoreContactsFromEmail = (): { restoredCount: number } => {
    // Merge archived contacts that are not already in contacts
    const existingPhones = new Set(contacts.map((c) => c.phone.replace(/[\s-]/g, '')));
    const toAdd: Contact[] = [];

    ARCHIVED_EMAIL_CONTACTS.forEach((arch) => {
      const cleanPhone = arch.phone.replace(/[\s-]/g, '');
      if (!existingPhones.has(cleanPhone)) {
        toAdd.push({
          ...arch,
          id: `restored-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          lastSynced: 'রিস্টোর করা হয়েছে',
        });
      }
    });

    if (toAdd.length > 0) {
      setContacts((prev) => [...toAdd, ...prev]);
    }

    setLastEmailSyncTime('এইমাত্র সিঙ্ক হয়েছে');

    // Notify user
    setNotifications((prev) => [
      {
        id: `notif-restore-${Date.now()}`,
        title: 'ক্লাউড কন্টাক্ট রিস্টোর সফল!',
        message: `${userEmail} থেকে পুরোন ${toAdd.length > 0 ? toAdd.length : 5}টি ব্যাকআপ নাম্বার সফলভাবে পুনরুদ্ধার করা হয়েছে।`,
        time: 'এইমাত্র',
        type: 'backup',
        isRead: false,
      },
      ...prev,
    ]);

    return { restoredCount: toAdd.length > 0 ? toAdd.length : 5 };
  };

  // Cloud Sync & Backup
  const createCloudBackup = async (): Promise<void> => {
    setIsBackingUp(true);
    await new Promise((res) => setTimeout(res, 2000));

    const totalMsgs = conversations.reduce((acc, c) => acc + c.messages.length, 0);
    const newRecord: BackupRecord = {
      id: `b-${Date.now()}`,
      date: new Date().toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      size: `${(120 + Math.floor(Math.random() * 30)).toFixed(1)} MB`,
      itemCount: {
        messages: totalMsgs,
        contacts: contacts.length,
        media: sharedFiles.length + 850,
      },
      type: 'cloud',
      status: 'completed',
      email: userEmail,
    };

    setBackups((prev) => [newRecord, ...prev]);
    setIsBackingUp(false);

    setNotifications((prev) => [
      {
        id: `notif-sync-${Date.now()}`,
        title: 'ক্লাউড ব্যাকআপ সম্পন্ন',
        message: `সকল মেসেজ ও কন্টাক্ট সফলভাবে ${userEmail}-এ ব্যাকআপ হয়েছে।`,
        time: 'এইমাত্র',
        type: 'backup',
        isRead: false,
      },
      ...prev,
    ]);
  };

  const restoreBackup = (backupId: string) => {
    const found = backups.find((b) => b.id === backupId);
    if (found) {
      setNotifications((prev) => [
        {
          id: `notif-rest-${Date.now()}`,
          title: 'ব্যাকআপ রিস্টোর সফল',
          message: `${found.date}-এর ব্যাকআপ পয়েন্ট থেকে ডেটা পুনস্থাপন সম্পন্ন হয়েছে।`,
          time: 'এইমাত্র',
          type: 'backup',
          isRead: false,
        },
        ...prev,
      ]);
    }
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // File Sharing
  const uploadFile = (fileData: Omit<SharedFileItem, 'id' | 'uploadedAt'>) => {
    const newFile: SharedFileItem = {
      ...fileData,
      id: `f-${Date.now()}`,
      uploadedAt: 'এইমাত্র',
    };
    setSharedFiles((prev) => [newFile, ...prev]);
  };

  const deleteSharedFile = (id: string) => {
    setSharedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // App Update Checker
  const checkForUpdates = async (): Promise<boolean> => {
    setIsCheckingUpdate(true);
    await new Promise((res) => setTimeout(res, 2200));
    setIsCheckingUpdate(false);
    return true; // Already latest or successfully checked
  };

  const toggleAutoCheckUpdates = () => {
    setAppUpdate((prev) => ({
      ...prev,
      autoCheckUpdates: !prev.autoCheckUpdates,
    }));
  };

  // Calling
  const startCall = (contact: Contact, type: 'audio' | 'video') => {
    setActiveCall({
      isActive: true,
      contact,
      type,
      status: 'ringing',
      durationSeconds: 0,
      isMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
    });

    // Simulate answering after 2 seconds
    setTimeout(() => {
      setActiveCall((prev) => {
        if (prev.isActive) {
          return { ...prev, status: 'connected' };
        }
        return prev;
      });
    }, 2000);
  };

  const endCall = () => {
    setActiveCall({
      isActive: false,
      contact: undefined,
      type: 'audio',
      status: 'ended',
      durationSeconds: 0,
      isMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
    });
  };

  const toggleCallMute = () => {
    setActiveCall((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleCallVideo = () => {
    setActiveCall((prev) => ({ ...prev, isVideoOff: !prev.isVideoOff }));
  };

  const toggleCallSpeaker = () => {
    setActiveCall((prev) => ({ ...prev, isSpeakerOn: !prev.isSpeakerOn }));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedConversationId,
        setSelectedConversationId,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        language,
        setLanguage,
        conversations,
        sendMessage,
        createOrOpenConversation,
        markConversationAsRead,
        togglePinConversation,
        contacts,
        addContact,
        updateContact,
        deleteContact,
        restoreContactsFromEmail,
        userEmail,
        setUserEmail,
        isEmailConnected,
        setIsEmailConnected,
        lastEmailSyncTime,
        twoFactorEnabled,
        setTwoFactorEnabled,
        twoFactorMethod,
        setTwoFactorMethod,
        appPinEnabled,
        setAppPinEnabled,
        isAppLocked,
        setIsAppLocked,
        securitySessions,
        backups,
        isBackingUp,
        createCloudBackup,
        restoreBackup,
        autoSyncEnabled,
        setAutoSyncEnabled,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        sharedFiles,
        uploadFile,
        deleteSharedFile,
        appUpdate,
        isCheckingUpdate,
        checkForUpdates,
        toggleAutoCheckUpdates,
        activeCall,
        startCall,
        endCall,
        toggleCallMute,
        toggleCallVideo,
        toggleCallSpeaker,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
