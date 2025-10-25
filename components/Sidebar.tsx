import React from 'react';
import { BookOpenIcon, ChartBarIcon, LightBulbIcon, PlusIcon, DocumentTextIcon, ScaleIcon, CalendarDaysIcon, HomeIcon, LockClosedIcon, ChatBubbleOvalLeftEllipsisIcon } from './icons';
import { SubscriptionTier, View } from '../types';


interface SidebarProps {
    activeView: View;
    onViewChange: (view: View) => void;
    reportCount: number;
    isOpen: boolean;
    subscriptionTier: SubscriptionTier;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
    isLocked?: boolean;
}> = ({ icon, label, isActive, onClick, disabled, isLocked }) => {
    const baseClasses = "flex items-center justify-between w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 relative";
    const activeClasses = "bg-blue-800 text-white font-semibold";
    const inactiveClasses = "text-gray-300 hover:bg-blue-900 hover:text-white";
    const disabledClasses = "text-blue-600/50 cursor-not-allowed";

    const effectiveDisabled = disabled || isLocked;

    return (
        <button
            onClick={onClick}
            disabled={effectiveDisabled}
            className={`${baseClasses} ${effectiveDisabled ? disabledClasses : (isActive ? activeClasses : inactiveClasses)}`}
        >
            <div className="flex items-center">
                <div className="w-5 h-5 mr-3">{icon}</div>
                <span>{label}</span>
            </div>
            {isLocked && <LockClosedIcon className="w-4 h-4 text-blue-400/60" />}
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, reportCount, isOpen, subscriptionTier }) => {
    const hasPlusAccess = subscriptionTier === 'Plus' || subscriptionTier === 'Pro';
    const hasProAccess = subscriptionTier === 'Pro';
    
    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 border-r border-blue-800 p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:flex lg:flex-col`}>
            <div className="flex flex-col h-full pt-16 lg:pt-0">
                <nav className="flex-grow space-y-1.5">
                    <NavItem
                        icon={<HomeIcon />}
                        label="Dashboard"
                        isActive={activeView === 'dashboard'}
                        onClick={() => onViewChange('dashboard')}
                    />
                    <NavItem
                        icon={<PlusIcon />}
                        label="New Report"
                        isActive={activeView === 'new_report'}
                        onClick={() => onViewChange('new_report')}
                    />
                    <NavItem
                        icon={<BookOpenIcon />}
                        label="Incident Timeline"
                        isActive={activeView === 'timeline'}
                        onClick={() => onViewChange('timeline')}
                    />
                    <NavItem
                        icon={<ChatBubbleOvalLeftEllipsisIcon />}
                        label="Communication Log"
                        isActive={activeView === 'messaging'}
                        onClick={() => onViewChange('messaging')}
                        isLocked={!hasPlusAccess}
                    />
                     <NavItem
                        icon={<CalendarDaysIcon />}
                        label="Calendar View"
                        isActive={activeView === 'calendar'}
                        onClick={() => onViewChange('calendar')}
                    />
                    <NavItem
                        icon={<ChartBarIcon />}
                        label="Pattern Analysis"
                        isActive={activeView === 'patterns'}
                        onClick={() => onViewChange('patterns')}
                        disabled={reportCount < 2}
                        isLocked={!hasPlusAccess}
                    />
                     <NavItem
                        icon={<DocumentTextIcon />}
                        label="Document Library"
                        isActive={activeView === 'documents'}
                        onClick={() => onViewChange('documents')}
                        isLocked={!hasPlusAccess}
                    />
                     <NavItem
                        icon={<ScaleIcon />}
                        label="Legal Assistant"
                        isActive={activeView === 'assistant'}
                        onClick={() => onViewChange('assistant')}
                        isLocked={!hasPlusAccess}
                    />
                     <NavItem
                        icon={<LightBulbIcon />}
                        label="Deep Analysis"
                        isActive={activeView === 'insights'}
                        onClick={() => onViewChange('insights')}
                        disabled={reportCount < 1}
                        isLocked={!hasProAccess}
                    />
                </nav>
                <div className="flex-shrink-0 mt-4 p-2">
                     <div className="text-left">
                        <h3 className="text-lg font-bold text-white">CustodyX<span className="text-blue-400 font-medium">.ai</span></h3>
                        <p className="text-xs text-gray-400">An R² Technologies Project.</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;