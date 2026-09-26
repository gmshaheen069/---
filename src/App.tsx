import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { MessagesView } from './components/Messages/MessagesView';
import { ContactsView } from './components/Contacts/ContactsView';
import { BackupView } from './components/Backup/BackupView';
import { SecurityView } from './components/Security/SecurityView';
import { CallsView } from './components/Calls/CallsView';
import { FileSharingView } from './components/FileSharing/FileSharingView';
import { UpdatesView } from './components/Updates/UpdatesView';
import { SearchModal } from './components/SearchModal';
import { PinLockScreen } from './components/PinLockScreen';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  PhoneCall,
  CloudUpload,
  Share2,
  ShieldCheck,
  DownloadCloud,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, conversations, contacts, language } = useApp();
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'messages':
        return <MessagesView />;
      case 'contacts':
        return <ContactsView />;
      case 'call':
        return <CallsView />;
      case 'backup':
        return <BackupView />;
      case 'files':
        return <FileSharingView />;
      case 'security':
        return <SecurityView />;
      case 'updates':
        return <UpdatesView />;
      default:
        return <DashboardView />;
    }
  };

  const mobileNavItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'messages', label: 'মেসেজ', icon: MessageSquare, badge: totalUnread },
    { id: 'contacts', label: 'কন্টাক্টস', icon: Users, badge: contacts.length },
    { id: 'call', label: 'কলিং', icon: PhoneCall },
    { id: 'backup', label: 'ক্লাউড', icon: CloudUpload },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block shrink-0">
          <Sidebar />
        </div>

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 bg-slate-950">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 border-t border-slate-800 backdrop-blur-lg flex items-center justify-around px-2 z-40">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition relative ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-slate-950 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Global Modals */}
      <SearchModal />
      <PinLockScreen />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
