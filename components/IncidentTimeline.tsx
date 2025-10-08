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
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full inline-block border border-teal-200">{report.category}</span>
                </div>
                <time className="text-sm text-gray-500 font-medium">{new Date(report.createdAt).toLocaleString()}</time>
            </div>
             <div className="prose prose-base max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                 {report.content.split('\n').map((line, index) => {
                     if (line.startsWith('### ')) {
                         return <h3 key={index} className="font-bold text-gray-900 mt-6 mb-3 text-lg">{line.substring(4)}</h3>
                     }
                     return <p key={index} className="my-2 text-base">{line}</p>
                 })}
             </div>
            {report.legalContext && (
                <div className="mt-6 p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <ScaleIcon className="w-5 h-5 text-amber-700" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-base font-bold text-amber-900 mb-2">Legal Context Note</h4>
                            <p className="text-sm text-amber-800 leading-relaxed">{report.legalContext}</p>
                        </div>
                    </div>
                </div>
            )}
            {report.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                    {report.tags.map((tag, index) => (
                        <span key={index} className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
             <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                 <button
                    onClick={() => onAnalyze(report.id)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-900 bg-amber-50 rounded-lg hover:bg-amber-100 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                >
                    <LightBulbIcon className="w-5 h-5" />
                    Analyze Behavior
                </button>
                <button
                    onClick={() => onDiscuss(report.id)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm hover:shadow-md transition-all"
                >
                    <ScaleIcon className="w-5 h-5" />
                    Discuss with AI
                </button>
            </div>
        </div>
    )
}

const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ reports, onDiscussIncident, onAnalyzeIncident }) => {
    if (reports.length === 0) {
        return (
            <div className="text-center py-32 bg-gradient-to-br from-slate-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl">
                <div className="p-4 bg-white rounded-full inline-block shadow-sm mb-4">
                    <BookOpenIcon className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">No Incidents Logged</h3>
                <p className="mt-3 text-base text-gray-600 max-w-md mx-auto leading-relaxed">
                    Click the 'New Report' button in the sidebar to start documenting your first incident.
                </p>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Incident Timeline</h1>
                <p className="text-gray-600">Review and analyze your documented incidents</p>
            </div>
            {reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(report => (
                <IncidentCard key={report.id} report={report} onDiscuss={onDiscussIncident} onAnalyze={onAnalyzeIncident} />
            ))}
        </div>
    );
};

export default IncidentTimeline;
