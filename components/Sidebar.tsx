import React, { useState } from 'react';
import { BookOpenIcon, ChartBarIcon, LightBulbIcon, PlusIcon, DocumentTextIcon, ScaleIcon, PencilIcon, ChevronDownIcon } from './icons';

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
    badge?: number;
}> = ({ icon, label, isActive, onClick, disabled, badge }) => {
    const baseClasses = "flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1";
    const activeClasses = "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm";
    const inactiveClasses = "text-gray-700 hover:bg-gray-50 hover:text-gray-900";
    const disabledClasses = "text-gray-400 cursor-not-allowed opacity-50";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${disabled ? disabledClasses : (isActive ? activeClasses : inactiveClasses)}`}
        >
            <div className="flex items-center">
                <div className="w-5 h-5 mr-3">{icon}</div>
                <span>{label}</span>
            </div>
            {badge !== undefined && badge > 0 && (
                <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {badge}
                </span>
            )}
        </button>
    );
};

const SectionHeader: React.FC<{
    title: string;
    isCollapsed: boolean;
    onToggle: () => void;
}> = ({ title, isCollapsed, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
        >
            <span>{title}</span>
            <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, reportCount, isOpen }) => {
    const [reportsCollapsed, setReportsCollapsed] = useState(false);
    const [analysisCollapsed, setAnalysisCollapsed] = useState(false);
    const [documentsCollapsed, setDocumentsCollapsed] = useState(false);

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:flex-shrink-0 lg:shadow-none`}>
            <div className="flex flex-col h-full pt-16 lg:pt-0 overflow-y-auto">
                <nav className="flex-1 px-3 py-4 space-y-6">
                    <div>
                        <SectionHeader
                            title="Reports"
                            isCollapsed={reportsCollapsed}
                            onToggle={() => setReportsCollapsed(!reportsCollapsed)}
                        />
                        {!reportsCollapsed && (
                            <div className="space-y-1 mt-1">
                                <NavItem
                                    icon={<PlusIcon />}
                                    label="New Report"
                                    isActive={activeView === 'new_report'}
                                    onClick={() => onViewChange('new_report')}
                                />
                                <NavItem
                                    icon={<BookOpenIcon />}
                                    label="Timeline"
                                    isActive={activeView === 'timeline'}
                                    onClick={() => onViewChange('timeline')}
                                    badge={reportCount}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <SectionHeader
                            title="Analysis"
                            isCollapsed={analysisCollapsed}
                            onToggle={() => setAnalysisCollapsed(!analysisCollapsed)}
                        />
                        {!analysisCollapsed && (
                            <div className="space-y-1 mt-1">
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
                            </div>
                        )}
                    </div>

                    <div>
                        <SectionHeader
                            title="Documents"
                            isCollapsed={documentsCollapsed}
                            onToggle={() => setDocumentsCollapsed(!documentsCollapsed)}
                        />
                        {!documentsCollapsed && (
                            <div className="space-y-1 mt-1">
                                <NavItem
                                    icon={<DocumentTextIcon />}
                                    label="Library"
                                    isActive={activeView === 'documents'}
                                    onClick={() => onViewChange('documents')}
                                />
                                <NavItem
                                    icon={<PencilIcon />}
                                    label="Drafted Docs"
                                    isActive={activeView === 'drafted_documents'}
                                    onClick={() => onViewChange('drafted_documents')}
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <NavItem
                            icon={<ScaleIcon />}
                            label="Legal Assistant"
                            isActive={activeView === 'assistant'}
                            onClick={() => onViewChange('assistant')}
                        />
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;