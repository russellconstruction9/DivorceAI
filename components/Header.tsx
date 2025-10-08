import React from 'react';
import { MenuIcon, UserCircleIcon, SparklesIcon } from './icons';

interface HeaderProps {
    onMenuClick: () => void;
    onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onProfileClick }) => {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Open menu"
                    >
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <svg className="h-9 w-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#0d9488" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                            <rect width="40" height="40" rx="10" fill="url(#grad1)"/>
                            <path d="M20 10L28 16V24L20 30L12 24V16L20 10Z" fill="white" opacity="0.9"/>
                            <circle cx="20" cy="20" r="3" fill="#0d9488"/>
                        </svg>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-gray-900">CustodyX<span className="text-teal-600">.AI</span></span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <SparklesIcon className="h-3 w-3 text-teal-500" />
                                <span className="text-xs text-gray-500 font-medium">AI-Powered Co-Parenting</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onProfileClick}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label="Open profile"
                >
                    <UserCircleIcon className="h-8 w-8" />
                </button>
            </div>
        </header>
    );
};

export default Header;
