import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  Files,
  Calendar,
  Gift,
  MapPin,
  ClipboardList,
  Truck,
  Building2,
  BarChart3,
  Shield,
  Layers,
  Recycle,
  Sparkles,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { UserRole } from '../types.js';

export const Sidebar: React.FC = () => {
  const { user, quickLoginAsRole } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const residentLinks = [
    { to: '/resident/dashboard', icon: LayoutDashboard, label: 'Overview', badge: null },
    { to: '/resident/report-waste', icon: FilePlus, label: 'Report Waste', badge: 'AI' },
    { to: '/resident/reports', icon: Files, label: 'My Complaints', badge: null },
    { to: '/resident/calendar', icon: Calendar, label: 'Collection Schedule', badge: null },
    { to: '/recycling-locator', icon: MapPin, label: 'Recycling Centers', badge: null },
    { to: '/resident/rewards', icon: Gift, label: 'Rewards & Points', badge: 'New' },
  ];

  const municipalLinks = [
    { to: '/municipal/dashboard', icon: LayoutDashboard, label: 'Operations Console', badge: null },
    { to: '/municipal/complaints', icon: ClipboardList, label: 'Complaint Triage', badge: 'Live' },
    { to: '/municipal/map', icon: MapPin, label: 'Spatial GIS Map', badge: '3D' },
    { to: '/municipal/schedules', icon: Calendar, label: 'Collection Calendars', badge: null },
  ];

  const workerLinks = [
    { to: '/worker/dashboard', icon: Truck, label: 'Task Manifest', badge: 'Active' },
    { to: '/recycling-locator', icon: MapPin, label: 'Recycling Depots', badge: null },
  ];

  const partnerLinks = [
    { to: '/partner/dashboard', icon: Recycle, label: 'Verification Terminal', badge: 'Pro' },
    { to: '/recycling-locator', icon: MapPin, label: 'Depot Directory', badge: null },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: Shield, label: 'System Administration', badge: 'Root' },
    { to: '/municipal/map', icon: MapPin, label: 'National GIS Map', badge: null },
  ];

  let links = residentLinks;
  if (user.role === 'MUNICIPAL_OFFICER') links = municipalLinks;
  else if (user.role === 'COLLECTION_WORKER' || user.role === 'DRIVER') links = workerLinks;
  else if (user.role === 'RECYCLING_PARTNER') links = partnerLinks;
  else if (user.role === 'SYSTEM_ADMIN') links = adminLinks;

  const handlePersonaSwitch = async (role: UserRole) => {
    await quickLoginAsRole(role);
    switch (role) {
      case 'RESIDENT':
        navigate('/resident/dashboard');
        break;
      case 'MUNICIPAL_OFFICER':
        navigate('/municipal/dashboard');
        break;
      case 'COLLECTION_WORKER':
      case 'DRIVER':
        navigate('/worker/dashboard');
        break;
      case 'RECYCLING_PARTNER':
        navigate('/partner/dashboard');
        break;
      case 'SYSTEM_ADMIN':
        navigate('/admin/dashboard');
        break;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SYSTEM_ADMIN': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
      case 'MUNICIPAL_OFFICER': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      case 'RECYCLING_PARTNER': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
      case 'COLLECTION_WORKER': case 'DRIVER': return 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300';
      default: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
    }
  };

  return (
    <aside className="w-64 bg-white/95 dark:bg-[#101916]/95 backdrop-blur-md border-r border-[#DFE8E2] dark:border-[#293B31] flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 transition-colors shadow-sm">
      <div className="p-4 space-y-5 overflow-y-auto">
        {/* User Workspace Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#EAF5EE] to-[#E4F4EA] dark:from-[#17251F] dark:to-[#13201A] border border-[#DFE8E2] dark:border-[#293B31] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#138A5B] to-[#0F766E] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#138A5B]/25 shrink-0">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-[#172B23] dark:text-[#F1F7F3] truncate">
                {user.fullName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#138A5B] dark:bg-[#43D99A] animate-pulse" />
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${getRoleColor(user.role)}`}>
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-[#8FA196] dark:text-[#46574F] mb-2">
            Main Navigation
          </p>
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#138A5B] text-white shadow-md shadow-[#138A5B]/25'
                      : 'text-[#46574F] dark:text-[#C1CEC5] hover:bg-[#EAF5EE] dark:hover:bg-[#1B2922] hover:text-[#172B23] dark:hover:text-[#F1F7F3]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#138A5B] dark:text-[#43D99A]'}`} />
                    <span className="truncate flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#E4F4EA] dark:bg-[#1B382B] text-[#138A5B] dark:text-[#43D99A]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Demo Switcher Footer */}
      <div className="p-3.5 border-t border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#101916]/80">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8FA196] dark:text-[#46574F] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Role Switcher</span>
          </p>
          <span className="text-[9px] text-[#8FA196]">Demo Mode</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => handlePersonaSwitch('RESIDENT')}
            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all text-center ${
              user.role === 'RESIDENT'
                ? 'bg-[#138A5B] text-white shadow-xs'
                : 'bg-white dark:bg-[#1B2922] text-[#46574F] dark:text-[#C1CEC5] border border-[#DFE8E2] dark:border-[#293B31] hover:bg-[#EAF5EE]'
            }`}
          >
            Resident
          </button>
          <button
            onClick={() => handlePersonaSwitch('MUNICIPAL_OFFICER')}
            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all text-center ${
              user.role === 'MUNICIPAL_OFFICER'
                ? 'bg-[#138A5B] text-white shadow-xs'
                : 'bg-white dark:bg-[#1B2922] text-[#46574F] dark:text-[#C1CEC5] border border-[#DFE8E2] dark:border-[#293B31] hover:bg-[#EAF5EE]'
            }`}
          >
            Officer
          </button>
          <button
            onClick={() => handlePersonaSwitch('COLLECTION_WORKER')}
            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all text-center ${
              user.role === 'COLLECTION_WORKER'
                ? 'bg-[#138A5B] text-white shadow-xs'
                : 'bg-white dark:bg-[#1B2922] text-[#46574F] dark:text-[#C1CEC5] border border-[#DFE8E2] dark:border-[#293B31] hover:bg-[#EAF5EE]'
            }`}
          >
            Worker
          </button>
          <button
            onClick={() => handlePersonaSwitch('RECYCLING_PARTNER')}
            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all text-center ${
              user.role === 'RECYCLING_PARTNER'
                ? 'bg-[#138A5B] text-white shadow-xs'
                : 'bg-white dark:bg-[#1B2922] text-[#46574F] dark:text-[#C1CEC5] border border-[#DFE8E2] dark:border-[#293B31] hover:bg-[#EAF5EE]'
            }`}
          >
            Partner
          </button>
          <button
            onClick={() => handlePersonaSwitch('SYSTEM_ADMIN')}
            className={`col-span-2 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all text-center ${
              user.role === 'SYSTEM_ADMIN'
                ? 'bg-[#138A5B] text-white shadow-xs'
                : 'bg-white dark:bg-[#1B2922] text-[#46574F] dark:text-[#C1CEC5] border border-[#DFE8E2] dark:border-[#293B31] hover:bg-[#EAF5EE]'
            }`}
          >
            System Administrator
          </button>
        </div>
      </div>
    </aside>
  );
};
