import React, { useState } from 'react';
import { BookOpenIcon, ChartBarIcon, LightBulbIcon, PlusIcon, DocumentTextIcon, ScaleIcon, PencilIcon, ChevronDownIcon } from './icons';

type View = 'timeline' | 'new_report' | 'patterns' | 'insights' | 'assistant' | 'profile' | 'documents' | 'drafted_documents';

interface SidebarProps {
    activeView: View;
    onViewChange: (view: View) => void;
    reportCount: number;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, reportCount, isOpen, onClose }) => {
    const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(true);

    const menuItems = [
        { id: 'timeline' as View, label: 'Calendar', icon: BookOpenIcon },
        { id: 'new_report' as View, label: 'New Report', icon: PlusIcon },
        { id: 'patterns' as View, label: 'Patterns', icon: ChartBarIcon },
        { id: 'insights' as View, label: 'Insights', icon: LightBulbIcon },
        { id: 'assistant' as View, label: 'Legal Assistant', icon: ScaleIcon },
    ];

    const documentItems = [
        { id: 'documents' as View, label: 'Document Library', icon: DocumentTextIcon },
        { id: 'drafted_documents' as View, label: 'Drafted Documents', icon: PencilIcon },
    ];

    const handleItemClick = (view: View) => {
        onViewChange(view);
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <nav className="h-full overflow-y-auto p-4 space-y-2">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                                        isActive
                                            ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={() => setIsDocumentsExpanded(!isDocumentsExpanded)}
                            className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <span>Documents</span>
                            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDocumentsExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isDocumentsExpanded && (
                            <div className="mt-1 space-y-1">
                                {documentItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeView === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleItemClick(item.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <div className="px-4 py-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                            <div className="text-2xl font-bold text-teal-700">{reportCount}</div>
                            <div className="text-xs text-gray-600 font-medium">Total Reports</div>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
