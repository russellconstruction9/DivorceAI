import React from 'react';
import { BookOpenIcon, ChartBarIcon, LightBulbIcon, PlusIcon, DocumentTextIcon, ScaleIcon } from './icons';

type View = 'timeline' | 'new_report' | 'patterns' | 'insights' | 'assistant' | 'profile' | 'documents';

interface SidebarProps {
    activeView: View;
    onViewChange: (view: View) => void;
    reportCount: number;
    isOpen: boolean;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
}> = ({ icon, label, isActive, onClick, disabled }) => {
    const baseClasses = "flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";
    const activeClasses = "bg-blue-100 text-blue-900 font-semibold";
    const inactiveClasses = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
    const disabledClasses = "text-gray-400 cursor-not-allowed bg-gray-50";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${disabled ? disabledClasses : (isActive ? activeClasses : inactiveClasses)}`}
        >
            <div className="w-5 h-5 mr-3">{icon}</div>
            <span>{label}</span>
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, reportCount, isOpen }) => {
    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:flex-shrink-0`}>
            <div className="flex flex-col h-full pt-16 lg:pt-0">
                <nav className="flex-1 space-y-2">
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
                        icon={<ChartBarIcon />}
                        label="Pattern Analysis"
                        isActive={activeView === 'patterns'}
                        onClick={() => onViewChange('patterns')}
                        disabled={reportCount < 2}
                    />
                    <NavItem
                        icon={<LightBulbIcon />}
                        label="Behavioral Insights"
                        isActive={activeView === 'insights'}
                        onClick={() => onViewChange('insights')}
                        disabled={reportCount < 1}
                    />
                    <NavItem
                        icon={<DocumentTextIcon />}
                        label="Document Library"
                        isActive={activeView === 'documents'}
                        onClick={() => onViewChange('documents')}
                    />
                     <NavItem
                        icon={<ScaleIcon />}
                        label="Legal Assistant"
                        isActive={activeView === 'assistant'}
                        onClick={() => onViewChange('assistant')}
                    />
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;