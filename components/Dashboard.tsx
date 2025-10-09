import React from 'react';
import { Report, UserProfile } from '../types';
import { PlusIcon, CalendarDaysIcon, BookOpenIcon } from './icons';

type View = 'dashboard' | 'timeline' | 'new_report' | 'patterns' | 'insights' | 'assistant' | 'profile' | 'documents' | 'calendar';


interface DashboardProps {
    userProfile: UserProfile | null;
    reports: Report[];
    onViewChange: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, reports, onViewChange }) => {

    const sortedReports = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const recentReports = sortedReports.slice(0, 3);

    const welcomeMessage = userProfile?.name ? `Welcome back, ${userProfile.name}.` : 'Welcome to CustodyX.AI.';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{welcomeMessage}</h1>
                <p className="mt-2 text-base text-gray-600">Here's a summary of your recent activity. What would you like to do?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <button 
                    onClick={() => onViewChange('new_report')}
                    className="flex items-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-left hover:bg-blue-50 hover:border-blue-300 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <PlusIcon className="w-7 h-7 text-blue-800"/>
                    </div>
                    <div className="ml-5">
                        <h2 className="text-lg font-semibold text-gray-900">Log a New Incident</h2>
                        <p className="text-sm text-gray-600 mt-1">Start a conversation with the AI to document a new event.</p>
                    </div>
                </button>
                 <button 
                    onClick={() => onViewChange('calendar')}
                    className="flex items-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-left hover:bg-blue-50 hover:border-blue-300 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                     <div className="p-3 bg-blue-100 rounded-lg">
                        <CalendarDaysIcon className="w-7 h-7 text-blue-800"/>
                    </div>
                    <div className="ml-5">
                        <h2 className="text-lg font-semibold text-gray-900">View Calendar</h2>
                        <p className="text-sm text-gray-600 mt-1">See all your logged incidents in a monthly calendar view.</p>
                    </div>
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                 <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Incidents</h2>
                    <p className="text-sm text-gray-600 mt-1">Here are the last 3 incidents you've documented.</p>
                </div>
                {recentReports.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {recentReports.map(report => (
                            <li key={report.id} className="p-6 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-medium text-blue-800 bg-blue-100 px-3 py-1 rounded-full inline-block">{report.category}</p>
                                        <p className="text-sm text-gray-600 mt-3 max-w-xl truncate">
                                            {report.content.split('\n')[1] || 'No summary available.'}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-0.5 flex-shrink-0 ml-4">{new Date(report.createdAt).toLocaleDateString()}</p>
                                </div>
                            </li>
                        ))}
                         <li className="p-4 text-center">
                            <button 
                                onClick={() => onViewChange('timeline')} 
                                className="text-sm font-semibold text-blue-800 hover:text-blue-600"
                            >
                                View All Incidents &rarr;
                            </button>
                        </li>
                    </ul>
                ) : (
                    <div className="text-center py-16 px-6">
                         <BookOpenIcon className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">No Incidents Yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            When you log incidents, your three most recent will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;