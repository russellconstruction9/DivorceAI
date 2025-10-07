import React from 'react';
import { BookOpenIcon, UserCircleIcon, MenuIcon } from './icons';

interface HeaderProps {
    onMenuClick: () => void;
    onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onProfileClick }) => {
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
                        <div className="flex items-center">
                           <BookOpenIcon className="h-7 w-7 text-blue-900" />
                           <span className="ml-3 text-xl font-semibold text-gray-900 tracking-tight">CourtLog AI</span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button 
                            onClick={onProfileClick}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            aria-label="Open user profile"
                        >
                            <UserCircleIcon className="h-7 w-7" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;