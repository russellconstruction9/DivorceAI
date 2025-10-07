import React from 'react';
import { Report } from '../types';
import { BookOpenIcon, ScaleIcon, LightBulbIcon } from './icons';

interface IncidentTimelineProps {
    reports: Report[];
    onDiscussIncident: (reportId: string) => void;
    onAnalyzeIncident: (reportId: string) => void;
}

const IncidentCard: React.FC<{ report: Report, onDiscuss: (id: string) => void, onAnalyze: (id: string) => void }> = ({ report, onDiscuss, onAnalyze }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:border-gray-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-medium text-blue-800 bg-blue-100 px-3 py-1 rounded-full inline-block">{report.category}</p>
                </div>
                 <p className="text-xs text-gray-500 mt-1">{new Date(report.createdAt).toLocaleString()}</p>
            </div>
             <div className="prose prose-sm prose-slate max-w-none text-gray-700 whitespace-pre-wrap leading-6">
                 {report.content.split('\n').map((line, index) => {
                     if (line.startsWith('### ')) {
                         return <h3 key={index} className="font-semibold text-gray-800 mt-5 mb-1 text-base">{line.substring(4)}</h3>
                     }
                     return <p key={index} className="my-1.5">{line}</p>
                 })}
             </div>
            {report.legalContext && (
                <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex items-start">
                        <ScaleIcon className="w-5 h-5 text-amber-700 flex-shrink-0 mr-3 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-amber-900">Legal Context Note</h4>
                            <p className="text-sm text-amber-800 mt-1">{report.legalContext}</p>
                        </div>
                    </div>
                </div>
            )}
            {report.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                    {report.tags.map((tag, index) => (
                        <span key={index} className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
             <div className="mt-5 pt-4 border-t border-gray-200 flex justify-end gap-3">
                 <button
                    onClick={() => onAnalyze(report.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 rounded-md hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
                >
                    <LightBulbIcon className="w-4 h-4" />
                    Analyze Behavior
                </button>
                <button
                    onClick={() => onDiscuss(report.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                    <ScaleIcon className="w-4 h-4" />
                    Discuss with AI
                </button>
            </div>
        </div>
    )
}

const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ reports, onDiscussIncident, onAnalyzeIncident }) => {
    if (reports.length === 0) {
        return (
            <div className="text-center py-24 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                <BookOpenIcon className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">No Incidents Logged</h3>
                <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
                    Click the 'New Report' button in the sidebar to start documenting your first incident.
                </p>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Incident Timeline</h1>
            {reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(report => (
                <IncidentCard key={report.id} report={report} onDiscuss={onDiscussIncident} onAnalyze={onAnalyzeIncident} />
            ))}
        </div>
    );
};

export default IncidentTimeline;