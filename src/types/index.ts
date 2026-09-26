export type PlatformType = 'whatsapp' | 'messenger' | 'imo' | 'email' | 'sms' | 'omnichat';

export interface MessageAttachment {
  id: string;
  name: string;
  url?: string;
  type: 'image' | 'file' | 'audio' | 'video' | 'pdf';
  size: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  platform: PlatformType;
  status: 'sent' | 'delivered' | 'read';
  attachments?: MessageAttachment[];
  isStarred?: boolean;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactNumber: string;
  contactEmail?: string;
  contactAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  platform: PlatformType;
  availablePlatforms: PlatformType[];
  isPinned?: boolean;
  messages: Message[];
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar: string;
  category: 'family' | 'work' | 'friends' | 'other';
  platforms: PlatformType[];
  lastSynced: string;
  isBackedUp: boolean;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  platform?: PlatformType;
  type: 'message' | 'call' | 'security' | 'backup' | 'system';
  isRead: boolean;
  actionUrl?: string;
}

export interface BackupRecord {
  id: string;
  date: string;
  size: string;
  itemCount: {
    messages: number;
    contacts: number;
    media: number;
  };
  type: 'cloud' | 'local';
  status: 'completed' | 'in_progress' | 'failed';
  email: string;
}

export interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AppUpdateDetails {
  currentVersion: string;
  latestVersion: string;
  releaseDate: string;
  isUpToDate: boolean;
  autoCheckUpdates: boolean;
  changelog: string[];
}

export interface CallSession {
  isActive: boolean;
  contact?: Contact;
  type: 'audio' | 'video';
  status: 'ringing' | 'connected' | 'ended';
  durationSeconds: number;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
}

export interface SharedFileItem {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'doc' | 'archive' | 'audio';
  uploadedAt: string;
  sharedWith: string;
  platform: PlatformType;
  downloadUrl?: string;
}
