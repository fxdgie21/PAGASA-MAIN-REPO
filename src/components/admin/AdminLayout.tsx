import React, { useState, useEffect } from 'react';
import { useApp, ActivePage } from '../../context/AppContext';
import { PagasaLogo } from '../common/PagasaLogo';
import { 
  LayoutDashboard, 
  Users, 
  QrCode, 
  Calendar, 
  FolderGit2, 
  Megaphone, 
  Image as ImageIcon, 
  ShieldCheck, 
  Award, 
  BarChart3, 
  History, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  Sun, 
  Moon, 
  Camera, 
  Search, 
  X, 
  Menu, 
  Shield, 
  CheckCircle2, 
  Layers, 
  Radio
} from 'lucide-react';
import { ChangeProfilePictureModal } from '../common/ChangeProfilePictureModal';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItemDef {
  label: string;
  page: ActivePage;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category: 'core' | 'programs' | 'governance';
  description: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentUser, 
    currentRole, 
    logoutUser, 
    effectiveTheme, 
    toggleTheme,
    members,
    events
  } = useApp();

  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileDrawerOpen]);

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems: MenuItemDef[] = [
    // Core Operations
    { 
      label: 'MIS Dashboard', 
      page: 'admin-dashboard', 
      icon: LayoutDashboard, 
      category: 'core',
      description: 'Control center & live municipal KPIs'
    },
    { 
      label: 'Member Directory', 
      page: 'admin-members', 
      icon: Users, 
      badge: `${members.length}`, 
      category: 'core',
      description: 'Youth registry & credential management'
    },
    { 
      label: 'Live QR Attendance', 
      page: 'admin-attendance', 
      icon: QrCode, 
      badge: 'Live', 
      category: 'core',
      description: 'Fast camera scanner & session check-ins'
    },
    { 
      label: 'Events & Assemblies', 
      page: 'admin-events', 
      icon: Calendar, 
      category: 'core',
      description: 'Youth assemblies & attendance sessions'
    },

    // Programs & Media
    { 
      label: 'Community Projects', 
      page: 'admin-projects', 
      icon: FolderGit2, 
      category: 'programs',
      description: 'Barangay outreach & community initiatives'
    },
    { 
      label: 'Announcements', 
      page: 'admin-announcements', 
      icon: Megaphone, 
      category: 'programs',
      description: 'Municipal alerts & press releases'
    },
    { 
      label: 'Media Gallery', 
      page: 'admin-gallery', 
      icon: ImageIcon, 
      category: 'programs',
      description: 'High-res photos & documented activities'
    },
    { 
      label: 'Official Roster', 
      page: 'admin-officials', 
      icon: ShieldCheck, 
      category: 'programs',
      description: 'Executive officers & committee leadership'
    },

    // Governance & Compliance
    { 
      label: 'Certificate System', 
      page: 'admin-certificates', 
      icon: Award, 
      category: 'governance',
      description: 'Auto-generate certificates & digital badges'
    },
    { 
      label: 'Analytics & Reports', 
      page: 'admin-reports', 
      icon: BarChart3, 
      category: 'governance',
      description: 'Demographic trends & attendance metrics'
    },
    { 
      label: 'Audit Trail Logs', 
      page: 'admin-audit', 
      icon: History, 
      category: 'governance',
      description: 'Immutable system timestamps & activity records'
    },
    { 
      label: 'System Settings', 
      page: 'admin-settings', 
      icon: Settings, 
      category: 'governance',
      description: 'Organization preferences & MIS config'
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!menuSearchQuery.trim()) return true;
    const q = menuSearchQuery.toLowerCase();
    return item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
  });

  const currentItem = menuItems.find(item => item.page === currentPage) || menuItems[0];
  const CurrentIcon = currentItem.icon;

  const navigateTo = (page: ActivePage) => {
    setCurrentPage(page);
    setIsMobileDrawerOpen(false);
    setTimeout(() => {
      document.getElementById('admin-main-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  useEffect(() => {
    document.getElementById('admin-main-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-slate-100 flex flex-col lg:flex-row antialiased text-slate-900 selection:bg-blue-600 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* ========================================================= */}
      {/* 1. MOBILE STICKY APP BAR (Header for Phones & Tablets)    */}
      {/* ========================================================= */}
      <header className="lg:hidden sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-3.5 py-2.5 flex items-center justify-between shadow-lg no-print flex-shrink-0 w-full">
        {/* Left: Custom 10x Cooler Animated Burger Button + Mini Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/70 hover:border-sky-400/80 active:scale-90 transition-all flex flex-col items-center justify-center gap-1.5 shadow-md group cursor-pointer relative overflow-hidden flex-shrink-0"
            aria-label="Open Navigation Burger Menu"
            title="Toggle Admin Menu"
          >
            {/* Animated burger lines */}
            <span 
              className={`w-5 h-0.5 bg-sky-300 rounded-full transition-all duration-300 transform origin-center ${
                isMobileDrawerOpen ? 'rotate-45 translate-y-2 bg-sky-400' : 'group-hover:w-5.5'
              }`} 
            />
            <span 
              className={`w-4 h-0.5 bg-sky-400 rounded-full transition-all duration-200 ${
                isMobileDrawerOpen ? 'opacity-0 scale-x-0' : 'group-hover:w-5'
              }`} 
            />
            <span 
              className={`w-5 h-0.5 bg-sky-300 rounded-full transition-all duration-300 transform origin-center ${
                isMobileDrawerOpen ? '-rotate-45 -translate-y-2 bg-sky-400' : 'group-hover:w-5.5'
              }`} 
            />
            {/* Ambient indicator dot */}
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <div 
            onClick={() => navigateTo('admin-dashboard')}
            className="flex items-center gap-2 cursor-pointer min-w-0"
          >
            <PagasaLogo size={32} showText={false} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-white text-xs tracking-tight truncate">
                  PAGASA MIS
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {currentRole === 'SUPER_ADMIN' ? 'SUPER' : 'ADMIN'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <CurrentIcon className="w-2.5 h-2.5 text-sky-400" />
                <span className="text-slate-300 font-medium">{currentItem.label}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick QR Scanner Shortcut, Theme Toggle & Avatar */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => navigateTo('admin-attendance')}
            className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900 active:scale-95 transition-all cursor-pointer shadow-xs"
            title="Fast QR Camera Scanner"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {effectiveTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-sky-300" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsProfilePicModalOpen(true)}
            className="relative flex-shrink-0 p-0.5 rounded-full border-2 border-sky-400 hover:border-sky-300 transition-all cursor-pointer active:scale-95"
            title="Tap to change avatar"
          >
            <img
              src={currentUser?.avatar}
              alt=""
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. 10X COOLER MOBILE NAVIGATION BURGER DRAWER (SLIDE-OVER) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex no-print">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Slide-out Drawer Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-[88vw] max-w-sm h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200 shadow-2xl border-r border-slate-800/90 flex flex-col z-10 overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-500 rounded-full blur-xs opacity-75" />
                    <PagasaLogo size={40} showText={false} />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-white text-base tracking-tight leading-tight">
                      PAGASA MIS
                    </h2>
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                      Guimba Youth Portal
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Admin Profile Hero Card Inside Drawer */}
              <div className="p-4 bg-slate-900/80 border-b border-slate-800/90">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0 group">
                      <img
                        src={currentUser?.avatar}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-sky-400 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfilePicModalOpen(true);
                          setIsMobileDrawerOpen(false);
                        }}
                        title="Change Profile Photo"
                        className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg shadow-md hover:bg-blue-500 transition-colors cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate">{currentUser?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/40">
                          <Shield className="w-2.5 h-2.5 text-sky-400" />
                          {currentRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Officer'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fast Portal Switchers */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => navigateTo('member-dashboard')}
                    className="px-2.5 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-sky-300 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Member App</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('home')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-slate-300 text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                    <span>Public Site</span>
                  </button>
                </div>
              </div>

              {/* Instant Menu Search Filter */}
              <div className="px-4 pt-3 pb-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    placeholder="Quick jump to any MIS tool..."
                    className="w-full pl-8.5 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                  {menuSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setMenuSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categorized Navigation Links Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
                {/* 1. Core MIS Operations */}
                <div className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Core Operations</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                  {filteredMenuItems
                    .filter(item => item.category === 'core')
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.page;
                      return (
                        <button
                          key={item.page}
                          type="button"
                          onClick={() => navigateTo(item.page)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/30 border-l-4 border-sky-300'
                              : 'text-slate-300 hover:text-white hover:bg-slate-900 active:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-sky-400'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="text-left min-w-0">
                              <span className="block truncate font-bold">{item.label}</span>
                              <span className={`block text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                                {item.description}
                              </span>
                            </div>
                          </div>
                          {item.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex-shrink-0 ${
                              item.badge === 'Live'
                                ? 'bg-emerald-500 text-slate-950 animate-pulse shadow-xs shadow-emerald-500/50'
                                : 'bg-slate-800 text-sky-300 border border-slate-700'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>

                {/* 2. Programs & Media */}
                <div className="space-y-1 pt-1">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Programs & Media</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  {filteredMenuItems
                    .filter(item => item.category === 'programs')
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.page;
                      return (
                        <button
                          key={item.page}
                          type="button"
                          onClick={() => navigateTo(item.page)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/30 border-l-4 border-sky-300'
                              : 'text-slate-300 hover:text-white hover:bg-slate-900 active:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-emerald-400'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="text-left min-w-0">
                              <span className="block truncate font-bold">{item.label}</span>
                              <span className={`block text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                                {item.description}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                        </button>
                      );
                    })}
                </div>

                {/* 3. Governance & System */}
                <div className="space-y-1 pt-1">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Governance & Settings</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </div>
                  {filteredMenuItems
                    .filter(item => item.category === 'governance')
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.page;
                      return (
                        <button
                          key={item.page}
                          type="button"
                          onClick={() => navigateTo(item.page)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/30 border-l-4 border-sky-300'
                              : 'text-slate-300 hover:text-white hover:bg-slate-900 active:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-amber-400'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="text-left min-w-0">
                              <span className="block truncate font-bold">{item.label}</span>
                              <span className={`block text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                                {item.description}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400">Appearance Mode</span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    {effectiveTheme === 'dark' ? (
                      <>
                        <Sun className="w-3 h-3 text-amber-400" />
                        <span>Dark Theme</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3 h-3 text-sky-300" />
                        <span>Light Theme</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    logoutUser();
                  }}
                  className="w-full py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out of MIS</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 3. DESKTOP PERMANENT SIDEBAR (Hidden on mobile < lg)       */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex w-64 h-full bg-slate-950 text-slate-300 flex-shrink-0 flex-col justify-between border-r border-slate-800 no-print overflow-y-auto z-20">
        <div className="p-6 space-y-6">
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <PagasaLogo size={42} showText={false} />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-sm tracking-tight font-display truncate">
                PAGASA MIS
              </h2>
              <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider block truncate">
                {currentRole === 'SUPER_ADMIN' ? 'Super Admin Portal' : 'Admin & Officer Portal'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => setCurrentPage(item.page)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase flex-shrink-0 ${
                      item.badge === 'Live'
                        ? 'bg-emerald-500 text-slate-950 animate-pulse'
                        : 'bg-slate-800 text-sky-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900 space-y-3 bg-slate-950/60">
          <div className="flex items-center justify-between px-2 py-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] font-semibold text-slate-400">Theme Mode</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 text-[10px] font-bold transition-colors cursor-pointer"
              title="Toggle Light / Dark Mode"
            >
              {effectiveTheme === 'dark' ? (
                <>
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-sky-300" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage('member-dashboard')}
            className="w-full py-2 px-3 bg-blue-950/80 hover:bg-blue-900/90 text-sky-200 border border-blue-800/60 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" />
              <span className="truncate">Member Portal</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
              <span className="truncate">Public Website</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          </button>

          {/* Current Admin User Status & Avatar Modal Trigger */}
          <div className="flex items-center justify-between gap-2 text-xs pt-1">
            <button
              type="button"
              onClick={() => setIsProfilePicModalOpen(true)}
              className="flex items-center gap-2 min-w-0 flex-1 p-1 -m-1 rounded-lg hover:bg-slate-900 transition-colors text-left group cursor-pointer"
              title="Click to change profile avatar"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={currentUser?.avatar}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover border border-slate-700 group-hover:border-sky-400 transition-colors"
                />
                <span className="absolute -bottom-1 -right-1 bg-slate-800 text-sky-400 rounded-full p-0.5 shadow-xs group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Camera className="w-2.5 h-2.5" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-white block truncate group-hover:text-sky-300 transition-colors">
                  {currentUser?.name}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">
                  Click to edit avatar
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={logoutUser}
              className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/40 transition-colors flex-shrink-0 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 4. MAIN ADMIN CONTENT BODY (Independent Scroll Viewport)   */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <main 
          id="admin-main-viewport" 
          className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 pb-36 lg:pb-12 overflow-y-auto overflow-x-hidden max-w-full scroll-smooth"
        >
          {children}
        </main>
      </div>

      {/* ========================================================= */}
      {/* 5. MOBILE BOTTOM THUMB DOCK (Fast One-Tap Navigation)     */}
      {/* ========================================================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2 flex items-center justify-around shadow-2xl no-print pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          onClick={() => navigateTo('admin-dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentPage === 'admin-dashboard'
              ? 'text-sky-400 font-extrabold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Dashboard</span>
          {currentPage === 'admin-dashboard' && (
            <span className="w-1 h-1 rounded-full bg-sky-400" />
          )}
        </button>

        {/* Tab 2: Members */}
        <button
          type="button"
          onClick={() => navigateTo('admin-members')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentPage === 'admin-members'
              ? 'text-sky-400 font-extrabold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Members</span>
          {currentPage === 'admin-members' && (
            <span className="w-1 h-1 rounded-full bg-sky-400" />
          )}
        </button>

        {/* Tab 3: Central Elevated QR Scanner Button */}
        <button
          type="button"
          onClick={() => navigateTo('admin-attendance')}
          className="flex flex-col items-center -mt-6 bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 text-white p-3 rounded-2xl shadow-xl shadow-sky-500/40 active:scale-95 transition-transform border-2 border-slate-950 cursor-pointer"
          title="Scan Live Attendance"
        >
          <QrCode className="w-6 h-6 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Scan QR</span>
        </button>

        {/* Tab 4: Events */}
        <button
          type="button"
          onClick={() => navigateTo('admin-events')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentPage === 'admin-events'
              ? 'text-sky-400 font-extrabold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Events</span>
          {currentPage === 'admin-events' && (
            <span className="w-1 h-1 rounded-full bg-sky-400" />
          )}
        </button>

        {/* Tab 5: Burger Menu Trigger */}
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            isMobileDrawerOpen || (!['admin-dashboard', 'admin-members', 'admin-attendance', 'admin-events'].includes(currentPage))
              ? 'text-sky-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Menu className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-400" />
          </div>
          <span className="text-[10px]">All Tools</span>
        </button>
      </nav>

      {/* Profile Picture Modal */}
      <ChangeProfilePictureModal
        isOpen={isProfilePicModalOpen}
        onClose={() => setIsProfilePicModalOpen(false)}
        userType="admin"
        initialAvatar={currentUser?.avatar}
      />
    </div>
  );
};
