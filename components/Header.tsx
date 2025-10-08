import React, { useState, useRef, useEffect } from 'react';
import { UserCircleIcon, MenuIcon } from './icons';

interface HeaderProps {
    onMenuClick: () => void;
    onProfileClick: () => void;
    onSignOut?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onProfileClick, onSignOut }) => {
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
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={onMenuClick}
                            className="mr-2 p-2 rounded-full text-gray-500 hover:bg-gray-100 lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            aria-label="Open menu"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="8" fill="#1e3a8a"/>
                                <path d="M20 8L28 14V26L20 32L12 26V14L20 8Z" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5"/>
                                <circle cx="20" cy="20" r="4" fill="#dbeafe"/>
                            </svg>
                            <span className="text-xl font-bold text-gray-900">CustodyX<span className="text-blue-900">.AI</span></span>
                        </div>
                    </div>
                    <div className="flex items-center relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            aria-label="User menu"
                        >
                            <UserCircleIcon className="h-7 w-7" />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                                <button
                                    onClick={() => {
                                        onProfileClick();
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile Settings
                                </button>
                                {onSignOut && (
                                    <button
                                        onClick={() => {
                                            onSignOut();
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Sign Out
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;