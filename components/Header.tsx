import React, { useState, useRef, useEffect } from 'react';
import { UserCircleIcon, MenuIcon, PlusIcon, DocumentTextIcon, SparklesIcon } from './icons';

interface HeaderProps {
    onMenuClick: () => void;
    onProfileClick: () => void;
    onSignOut?: () => void;
    onNewReport?: () => void;
    onNewDocument?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onProfileClick, onSignOut, onNewReport, onNewDocument }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onMenuClick}
                            className="mr-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors"
                            aria-label="Open menu"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <svg className="h-9 w-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="10" fill="url(#grad1)"/>
                                <defs>
                                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:#0d9488;stop-opacity:1" />
                                        <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
                                    </linearGradient>
                                </defs>
                                <path d="M20 10L28 16V24L20 30L12 24V16L20 10Z" fill="white" opacity="0.9"/>
                                <circle cx="20" cy="20" r="3" fill="#0d9488"/>
                            </svg>
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold text-gray-900">CustodyX<span className="text-teal-600">.AI</span></span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <SparklesIcon className="h-3 w-3 text-teal-500" />
                                    <span className="text-xs text-gray-500 font-medium">AI Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {onNewReport && (
                            <button
                                onClick={onNewReport}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                            >
                                <PlusIcon className="h-4 w-4" />
                                New Report
                            </button>
                        )}
                        {onNewDocument && (
                            <button
                                onClick={onNewDocument}
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium transition-colors"
                            >
                                <DocumentTextIcon className="h-4 w-4" />
                                Upload
                            </button>
                        )}
                        <div className="flex items-center relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors"
                                aria-label="User menu"
                            >
                                <UserCircleIcon className="h-7 w-7" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                    <button
                                        onClick={() => {
                                            onProfileClick();
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Profile Settings
                                    </button>
                                    {onSignOut && (
                                        <button
                                            onClick={() => {
                                                onSignOut();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;