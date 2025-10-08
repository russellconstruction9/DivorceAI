import React, { useState } from 'react';
import { Report, CalendarEvent, EventType } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon, BookOpenIcon, ScaleIcon, LightBulbIcon } from './icons';

interface CalendarViewProps {
    reports: Report[];
    events: CalendarEvent[];
    onDiscussIncident: (reportId: string) => void;
    onAnalyzeIncident: (reportId: string) => void;
    onCreateEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
    onDeleteEvent: (id: string) => void;
}

interface DayEvent {
    id: string;
    title: string;
    description: string;
    type: 'report' | 'event';
    color: string;
    reportId?: string;
    eventData?: CalendarEvent;
}

const CalendarView: React.FC<CalendarViewProps> = ({
    reports,
    events,
    onDiscussIncident,
    onAnalyzeIncident,
    onCreateEvent,
    onDeleteEvent
}) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedDayEvents, setSelectedDayEvents] = useState<DayEvent[]>([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [newEventType, setNewEventType] = useState<EventType>(EventType.CUSTOM);
    const [newEventColor, setNewEventColor] = useState('blue');

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const lastDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const placeholders = Array.from({ length: startDayOfWeek });

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const isSameDay = (d1: Date, d2: Date | string) => {
        const date2 = typeof d2 === 'string' ? new Date(d2) : d2;
        return d1.getFullYear() === date2.getFullYear() &&
               d1.getMonth() === date2.getMonth() &&
               d1.getDate() === date2.getDate();
    };

    const getEventsForDate = (date: Date): DayEvent[] => {
        const dayEvents: DayEvent[] = [];

        reports.forEach(report => {
            if (isSameDay(date, report.createdAt)) {
                dayEvents.push({
                    id: report.id,
                    title: report.category,
                    description: report.content.substring(0, 100) + '...',
                    type: 'report',
                    color: 'teal',
                    reportId: report.id,
                });
            }
        });

        events.forEach(event => {
            if (isSameDay(date, event.eventDate)) {
                dayEvents.push({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    type: 'event',
                    color: event.color,
                    eventData: event,
                });
            }
        });

        return dayEvents;
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        const dayEvents = getEventsForDate(date);
        setSelectedDayEvents(dayEvents);
        setShowEventModal(true);
    };

    const handleCreateEvent = () => {
        if (!selectedDate || !newEventTitle.trim()) return;

        const dateStr = selectedDate.toISOString().split('T')[0];
        onCreateEvent({
            title: newEventTitle,
            description: newEventDescription,
            eventDate: dateStr,
            eventType: newEventType,
            color: newEventColor,
        });

        setNewEventTitle('');
        setNewEventDescription('');
        setNewEventType(EventType.CUSTOM);
        setNewEventColor('blue');

        const updatedEvents = getEventsForDate(selectedDate);
        setSelectedDayEvents([...updatedEvents, {
            id: 'temp',
            title: newEventTitle,
            description: newEventDescription,
            type: 'event',
            color: newEventColor,
        }]);
    };

    const handleDeleteEvent = (eventId: string) => {
        onDeleteEvent(eventId);
        setSelectedDayEvents(prev => prev.filter(e => e.id !== eventId));
    };

    const today = new Date();

    const colorOptions = [
        { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
        { value: 'green', label: 'Green', class: 'bg-green-500' },
        { value: 'red', label: 'Red', class: 'bg-red-500' },
        { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
        { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
        { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Calendar</h1>
                    <p className="text-gray-600 mt-1">View your incidents and events</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-200 p-6">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 hover:text-gray-900 transition-all"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </h2>
                        <button
                            onClick={() => changeMonth(1)}
                            className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 hover:text-gray-900 transition-all"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {daysOfWeek.map(day => (
                            <div key={day} className="text-center text-sm font-bold text-gray-700 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {placeholders.map((_, index) => (
                            <div key={`placeholder-${index}`} className="h-24 bg-gray-50 rounded-lg" />
                        ))}
                        {dates.map(date => {
                            const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), date);
                            const isToday = isSameDay(currentDate, today);
                            const dayEvents = getEventsForDate(currentDate);
                            const hasEvents = dayEvents.length > 0;

                            return (
                                <div
                                    key={date}
                                    onClick={() => handleDateClick(currentDate)}
                                    className={`h-24 border rounded-lg p-2 cursor-pointer transition-all hover:shadow-md ${
                                        isToday
                                            ? 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-300 ring-2 ring-teal-300'
                                            : hasEvents
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'bg-white border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-sm font-semibold ${isToday ? 'text-teal-700' : 'text-gray-700'}`}>
                                            {date}
                                        </span>
                                        {hasEvents && (
                                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                                {dayEvents.length}
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        {dayEvents.slice(0, 2).map((event, idx) => (
                                            <div
                                                key={idx}
                                                className={`text-xs px-1.5 py-0.5 rounded truncate ${
                                                    event.type === 'report'
                                                        ? 'bg-teal-100 text-teal-800 font-medium'
                                                        : `bg-${event.color}-100 text-${event.color}-800`
                                                }`}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <div className="text-xs text-gray-500 font-medium">
                                                +{dayEvents.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {showEventModal && selectedDate && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
                    onClick={() => setShowEventModal(false)}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </h2>
                            <button
                                onClick={() => setShowEventModal(false)}
                                className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-gray-700 transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <BookOpenIcon className="w-5 h-5 text-teal-600" />
                                    Events for this day
                                </h3>
                                {selectedDayEvents.length === 0 ? (
                                    <p className="text-gray-500 italic py-4">No events on this day</p>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedDayEvents.map(event => (
                                            <div
                                                key={event.id}
                                                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {event.type === 'report' ? (
                                                                <span className="text-xs font-semibold text-teal-700 bg-teal-100 px-2 py-1 rounded-full">
                                                                    Incident Report
                                                                </span>
                                                            ) : (
                                                                <span className={`text-xs font-semibold bg-${event.color}-100 text-${event.color}-700 px-2 py-1 rounded-full`}>
                                                                    {event.eventData?.eventType || 'Event'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="font-bold text-gray-900">{event.title}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                                    </div>
                                                    {event.type === 'event' && (
                                                        <button
                                                            onClick={() => handleDeleteEvent(event.id)}
                                                            className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                                                        >
                                                            <XMarkIcon className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                                {event.type === 'report' && event.reportId && (
                                                    <div className="flex gap-2 mt-3">
                                                        <button
                                                            onClick={() => {
                                                                onAnalyzeIncident(event.reportId!);
                                                                setShowEventModal(false);
                                                            }}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 rounded-lg hover:bg-amber-100 border border-amber-200 transition-colors"
                                                        >
                                                            <LightBulbIcon className="w-4 h-4" />
                                                            Analyze
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                onDiscussIncident(event.reportId!);
                                                                setShowEventModal(false);
                                                            }}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all"
                                                        >
                                                            <ScaleIcon className="w-4 h-4" />
                                                            Discuss
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                    <PlusIcon className="w-5 h-5 text-teal-600" />
                                    Add New Event
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={newEventTitle}
                                            onChange={(e) => setNewEventTitle(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            placeholder="Event title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={newEventDescription}
                                            onChange={(e) => setNewEventDescription(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                                            rows={3}
                                            placeholder="Event description"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                                            <select
                                                value={newEventType}
                                                onChange={(e) => setNewEventType(e.target.value as EventType)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            >
                                                <option value={EventType.CUSTOM}>Custom</option>
                                                <option value={EventType.APPOINTMENT}>Appointment</option>
                                                <option value={EventType.DEADLINE}>Deadline</option>
                                                <option value={EventType.OTHER}>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                                            <div className="flex gap-2">
                                                {colorOptions.map(color => (
                                                    <button
                                                        key={color.value}
                                                        onClick={() => setNewEventColor(color.value)}
                                                        className={`w-8 h-8 rounded-full ${color.class} ${
                                                            newEventColor === color.value ? 'ring-4 ring-offset-2 ring-gray-400' : ''
                                                        }`}
                                                        title={color.label}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCreateEvent}
                                        disabled={!newEventTitle.trim()}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        Create Event
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;
