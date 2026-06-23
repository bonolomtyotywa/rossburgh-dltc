'use client';

import { useState } from 'react';

type UpdateType = 'info' | 'warning' | 'danger' | 'success';

interface Update {
  id: number;
  type: UpdateType;
  title: string;
  message: string;
  date: string;
  time: string;
}

const updates: Update[] = [
  {
    id: 1,
    type: 'success',
    title: 'Centre is Open',
    message: 'Rossburgh DLTC is operating normally today. All services are available.',
    date: 'Monday, 23 June 2026',
    time: '07:00',
  },
  {
    id: 2,
    type: 'warning',
    title: 'High Volume Expected',
    message: 'Due to month-end, queues are expected to be longer than usual this week. Please arrive before 07:00 for faster service.',
    date: 'Monday, 23 June 2026',
    time: '06:30',
  },
  {
    id: 3,
    type: 'info',
    title: 'System Maintenance Notice',
    message: 'The online booking system will be unavailable on Wednesday from 12:00–14:00 for scheduled maintenance.',
    date: 'Sunday, 22 June 2026',
    time: '15:00',
  },
  {
    id: 4,
    type: 'danger',
    title: 'Load Shedding Alert',
    message: 'Stage 4 load shedding is scheduled for today. The centre may experience delays. Please bring patience and all documents.',
    date: 'Friday, 20 June 2026',
    time: '08:00',
  },
];

const typeConfig = {
  success: {
    icon: '✅',
    label: 'Normal',
    bg: 'bg-green-50',
    border: 'border-green-300',
    badge: 'bg-green-100 text-green-700',
    title: 'text-green-800',
  },
  warning: {
    icon: '⚠️',
    label: 'Warning',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    badge: 'bg-yellow-100 text-yellow-700',
    title: 'text-yellow-800',
  },
  danger: {
    icon: '🔴',
    label: 'Alert',
    bg: 'bg-red-50',
    border: 'border-red-300',
    badge: 'bg-red-100 text-red-700',
    title: 'text-red-800',
  },
  info: {
    icon: 'ℹ️',
    label: 'Info',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    badge: 'bg-blue-100 text-blue-700',
    title: 'text-blue-800',
  },
};

const filterOptions = ['All', 'Normal', 'Warning', 'Alert', 'Info'] as const;
type FilterOption = typeof filterOptions[number];

export default function UpdatesPage() {
  const [filter, setFilter] = useState<FilterOption>('All');

  const filtered = updates.filter((u) => {
    if (filter === 'All') return true;
    return typeConfig[u.type].label === filter;
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block bg-[#0EA5E9] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          Real-Time Notices
        </span>
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Live Updates</h1>
        <p className="text-gray-500 mt-2">
          Stay informed about closures, delays, load shedding and announcements.
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {(Object.keys(typeConfig) as UpdateType[]).map((type) => (
          <div
            key={type}
            className={`p-4 rounded-xl border ${typeConfig[type].bg} ${typeConfig[type].border} text-center`}
          >
            <div className="text-2xl mb-1">{typeConfig[type].icon}</div>
            <div className={`text-xs font-bold ${typeConfig[type].title}`}>
              {typeConfig[type].label}
            </div>
            <div className="text-lg font-black text-gray-700">
              {updates.filter((u) => u.type === type).length}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
              filter === option
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A]'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No updates found for this category.
          </div>
        )}

        {filtered.map((update) => {
          const cfg = typeConfig[update.type];
          return (
            <div
              key={update.id}
              className={`rounded-2xl border-2 ${cfg.border} ${cfg.bg} p-6`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{cfg.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-lg ${cfg.title}`}>
                        {update.title}
                      </h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {update.message}
                    </p>
                    <p className="text-gray-400 text-xs mt-3">
                      🕐 {update.date} at {update.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-10 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-sm text-gray-500">
        📢 Updates are posted by Rossburgh DLTC administration. Check back regularly for the latest notices.
      </div>

    </main>
  );
}