import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  Filter,
  ArrowUpDown,
  Lock,
  Sparkles,
  RefreshCw,
  Camera,
  KeyRound,
  Shield,
  Copy,
  Check,
  Eye,
  X
} from 'lucide-react';
import { ChangeProfilePictureModal } from '../common/ChangeProfilePictureModal';
import { Member } from '../../types';

export const MemberDirectoryPage: React.FC = () => {
  const { 
    members, 
    setCurrentPage, 
    currentRole, 
    currentUser, 
    fetchLatestMembers 
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Pending' | 'Inactive'>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'age'>('recent');
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [targetMemberForPhoto, setTargetMemberForPhoto] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);

  // Auto-fetch freshest member records, profile pictures, and credentials from Firestore on page load
  useEffect(() => {
    fetchLatestMembers().catch((err) => {
      console.warn('Initial cloud members fetch notice:', err);
    });
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await fetchLatestMembers();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          !query ||
          m.fullName.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          m.contactNumber.toLowerCase().includes(query) ||
          m.address.toLowerCase().includes(query) ||
          m.barangay.toLowerCase().includes(query) ||
          m.memberId.toLowerCase().includes(query);

        const matchesStatus = 
          statusFilter === 'ALL' || 
          m.membershipStatus === statusFilter;

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.fullName.localeCompare(b.fullName);
        }
        if (sortBy === 'age') {
          return a.age - b.age;
        }
        // Recent
        const dateA = new Date(a.registrationDate || a.membershipDate || '2025-01-01').getTime();
        const dateB = new Date(b.registrationDate || b.membershipDate || '2025-01-01').getTime();
        return dateB - dateA;
      });
  }, [members, searchQuery, statusFilter, sortBy]);

  const activeCount = members.filter(m => m.membershipStatus === 'Active').length;
  const pendingCount = members.filter(m => m.membershipStatus === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Youth Registry</span>
            </div>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              title="Fetch latest credentials and profile pictures from database"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3 h-3 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Member Directory
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Public directory of registered youth members in the Municipality of Guimba. Member credentials, profile pictures, and registration details automatically update in real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentPage('join')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Registration</span>
          </button>
          <button
            onClick={() => setCurrentPage('login')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-emerald-400" />
            <span>Member Login</span>
          </button>
          {(currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN') && (
            <button
              onClick={() => setCurrentPage('admin-members')}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management</span>
            </button>
          )}
        </div>
      </div>

      {/* Notice on Security & Confidentiality */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <div className="p-1.5 bg-slate-200 text-slate-700 rounded-lg flex-shrink-0 mt-0.5">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-slate-800">Security Guarantee: </span>
          Member credentials, profile pictures, and registration records are synchronized with the encrypted cloud database. Account holders and administrators can update profile pictures at any time.
        </div>
      </div>

      {/* Metrics Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Registered</p>
          <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{members.length}</p>
          <span className="text-[10px] text-slate-400">All registered youth</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Activated Accounts</p>
          <p className="text-2xl font-bold text-emerald-700 font-display mt-0.5">{activeCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Password set & active</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Activation</p>
          <p className="text-2xl font-bold text-amber-700 font-display mt-0.5">{pendingCount}</p>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting Admin password</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Barangays Covered</p>
          <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
            {new Set(members.map(m => m.barangay)).size}
          </p>
          <span className="text-[10px] text-slate-400">Guimba communities</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, Gmail, address, cellphone, member ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses ({members.length})</option>
              <option value="Active">Active ({activeCount})</option>
              <option value="Pending">Pending Activation ({pendingCount})</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
            >
              <option value="recent">Recently Registered</option>
              <option value="name">Name (A-Z)</option>
              <option value="age">Age</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table / Card Display */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              Showing {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
            </span>
            {isSyncing && (
              <span className="text-[11px] text-blue-600 flex items-center gap-1 font-medium">
                <RefreshCw className="w-3 h-3 animate-spin" /> Fetching cloud updates...
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Click on any member to view full details or change profile picture
          </p>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No members found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {members.length === 0
                ? 'Join PAGASA Guimba Youth Organization to be featured in the official member directory.'
                : 'Try adjusting your search criteria or register a new member using the button above.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px]">
                  <th className="py-3.5 px-4">Full Name & Avatar</th>
                  <th className="py-3.5 px-4">Credentials & Login</th>
                  <th className="py-3.5 px-4">Complete Address</th>
                  <th className="py-3.5 px-4">Birthday & Age</th>
                  <th className="py-3.5 px-4">Cellphone Number</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((m) => {
                  const isActivated = m.isAccountActivated === true || m.membershipStatus === 'Active';
                  const isCurrentUserMember = Boolean(
                    currentUser && (
                      (currentUser.id && m.id === currentUser.id) ||
                      (currentUser.memberId && m.memberId === currentUser.memberId) ||
                      (currentUser.email && m.email && m.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
                    )
                  );
                  const canChangePhoto = Boolean(
                    isCurrentUserMember || 
                    currentRole === 'SUPER_ADMIN' || 
                    currentRole === 'ADMIN'
                  );

                  return (
                    <tr 
                      key={m.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setViewingMember(m)}
                    >
                      {/* Full Name & Avatar */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0 group/avatar">
                            <img
                              src={m.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(m.fullName)}`}
                              alt={m.fullName}
                              className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(m.fullName)}`;
                              }}
                            />
                            {canChangePhoto && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTargetMemberForPhoto(m);
                                }}
                                title="Change Profile Picture"
                                className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity text-white cursor-pointer shadow-xs"
                              >
                                <Camera className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 text-sm">{m.fullName}</p>
                              {isCurrentUserMember && (
                                <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                                {m.memberId}
                              </span>
                              {canChangePhoto && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTargetMemberForPhoto(m);
                                  }}
                                  className="text-[10px] text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Camera className="w-2.5 h-2.5" />
                                  <span>Change Photo</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Credentials & Login (Gmail + ID + Portal Status) */}
                      <td className="py-3.5 px-4 font-mono" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-900 font-medium">
                            <Mail className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                            <span className="text-blue-700 font-semibold truncate max-w-[190px]" title={m.email}>
                              {m.email}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(m.email, `email-${m.id}`)}
                              title="Copy Email Credential"
                              className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100 cursor-pointer"
                            >
                              {copiedId === `email-${m.id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            {m.portalPassword ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-sans font-semibold">
                                <KeyRound className="w-2.5 h-2.5 text-emerald-600" />
                                Credentials Set
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-sans">
                                <KeyRound className="w-2.5 h-2.5 text-slate-400" />
                                Pending Assignment
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Complete Address */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="flex items-start gap-1.5 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-slate-900">{m.address}</p>
                            <p className="text-[11px] text-slate-500">Brgy. {m.barangay}</p>
                          </div>
                        </div>
                      </td>

                      {/* Birthday & Age */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{m.birthdate || 'N/A'}</span>
                          </div>
                          <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            {m.age} years old
                          </span>
                        </div>
                      </td>

                      {/* Cellphone Number */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{m.contactNumber || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Account Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isActivated ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Active (Activated)
                          </span>
                        ) : m.membershipStatus === 'Pending' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending Activation
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {m.registrationDate || m.membershipDate || '2026-01-01'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative group/avatar">
                  <img
                    src={viewingMember.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(viewingMember.fullName)}`}
                    alt={viewingMember.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                  />
                  {(currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN' || viewingMember.id === currentUser?.id || viewingMember.email === currentUser?.email) && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = viewingMember;
                        setViewingMember(null);
                        setTargetMemberForPhoto(target);
                      }}
                      title="Change Profile Picture"
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-md cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{viewingMember.fullName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {viewingMember.memberId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${viewingMember.membershipStatus === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {viewingMember.membershipStatus}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingMember(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-500 block font-medium">Gmail Account</span>
                  <span className="text-blue-700 font-semibold font-mono">{viewingMember.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Contact Number</span>
                  <span className="text-slate-900 font-medium font-mono">{viewingMember.contactNumber || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <div>
                  <span className="text-slate-500 block font-medium">Address & Barangay</span>
                  <span className="text-slate-900 font-medium">{viewingMember.address} (Brgy. {viewingMember.barangay})</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Birthday / Age</span>
                  <span className="text-slate-900 font-medium">{viewingMember.birthdate} ({viewingMember.age} yrs old)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <div>
                  <span className="text-slate-500 block font-medium">Organization Position</span>
                  <span className="text-slate-900 font-medium">{viewingMember.organizationPosition || 'Youth Member'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Registered Date</span>
                  <span className="text-slate-900 font-medium">{viewingMember.registrationDate || viewingMember.membershipDate || '2026-01-01'}</span>
                </div>
              </div>

              <div className="pt-3">
                <span className="text-slate-500 block font-medium">Portal Credentials Status</span>
                <div className="flex items-center gap-2 mt-1">
                  {viewingMember.portalPassword ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                      Login Credentials Configured
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 font-medium">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      Awaiting Administrator Password Setup
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              {(currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN' || viewingMember.id === currentUser?.id || viewingMember.email === currentUser?.email) && (
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingMember;
                    setViewingMember(null);
                    setTargetMemberForPhoto(target);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Profile Picture</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewingMember(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Profile Picture Modal */}
      {targetMemberForPhoto && (
        <ChangeProfilePictureModal
          isOpen={!!targetMemberForPhoto}
          onClose={() => setTargetMemberForPhoto(null)}
          userType="member"
          targetMemberId={targetMemberForPhoto.id}
          initialAvatar={targetMemberForPhoto.profilePicture}
          title={`Change ${targetMemberForPhoto.fullName}'s Profile Picture`}
        />
      )}
    </div>
  );
};
