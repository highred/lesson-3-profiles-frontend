import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { Profile, Role } from '../types';
import CalendarView from './CalendarView';
import EquipmentView from './EquipmentView';
import TechnicianView from './TechnicianView';
import CoordinatorView from './CoordinatorView';
import AdminView from './AdminView';
import { CalendarIcon } from './icons/CalendarIcon';
import { ToolIcon } from './icons/ToolIcon';
import { UserIcon } from './icons/UserIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

type TabName = 'Calendar' | 'Equipment' | 'Technician' | 'Coordinator' | 'Admin';

interface LayoutProps {
  session: Session;
  profile: Profile;
}

const TABS: { name: TabName, icon: React.ReactNode, allowedRoles: Role[] }[] = [
    { name: 'Calendar', icon: <CalendarIcon />, allowedRoles: ['technician', 'coordinator', 'admin'] },
    { name: 'Equipment', icon: <ToolIcon />, allowedRoles: ['technician', 'coordinator', 'admin'] },
    { name: 'Technician', icon: <UserIcon />, allowedRoles: ['technician'] },
    { name: 'Coordinator', icon: <ClipboardCheckIcon />, allowedRoles: ['coordinator', 'admin'] },
    { name: 'Admin', icon: <ShieldCheckIcon />, allowedRoles: ['admin'] },
];

const Layout: React.FC<LayoutProps> = ({ session, profile }) => {
  const visibleTabs = TABS.filter(tab => tab.allowedRoles.includes(profile.role));
  const [activeTab, setActiveTab] = useState<TabName>(visibleTabs[0].name);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'Calendar': return <CalendarView />;
      case 'Equipment': return <EquipmentView profile={profile} />;
      case 'Technician': return <TechnicianView profile={profile} />;
      case 'Coordinator': return <CoordinatorView />;
      case 'Admin': return <AdminView />;
      default: return null;
    }
  };

  if (!supabase) return null;

  return (
    <div>
        <div className="flex justify-between items-center mb-6 border-b border-base-300 pb-4">
            <div>
                <p className="text-gray-400">
                Signed in as: <span className="font-bold text-white">{profile.full_name || session.user.email}</span>
                </p>
                <p className="text-xs bg-brand-primary/20 text-brand-secondary px-2 py-1 rounded-full inline-block mt-1 capitalize">
                    {profile.role}
                </p>
            </div>
            <button
                onClick={() => supabase.auth.signOut()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition"
            >
                Sign Out
            </button>
        </div>

        <div className="mb-6">
            <div className="flex flex-wrap border-b border-base-300">
                {visibleTabs.map(tab => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`flex items-center gap-2 py-3 px-4 -mb-px font-semibold border-b-2 transition ${
                            activeTab === tab.name
                            ? 'border-brand-primary text-brand-primary'
                            : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                        }`}
                    >
                        {tab.icon}
                        {tab.name}
                    </button>
                ))}
            </div>
        </div>

        <div>
            {renderActiveView()}
        </div>
    </div>
  );
};

export default Layout;
