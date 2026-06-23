'use client';

import { useState } from 'react';

type QueueLevel = 'low' | 'medium' | 'high';

const queueConfig = {
  low: {
    label: 'Low',
    emoji: '🟢',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    wait: '15–30 minutes',
    advice: 'Great time to visit! Queues are short right now.',
  },
  medium: {
    label: 'Medium',
    emoji: '🟡',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    wait: '45–90 minutes',
    advice: 'Moderate queues. Arrive early and have documents ready.',
  },
  high: {
    label: 'High',
    emoji: '🔴',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    wait: '2–3 hours',
    advice: 'Very busy right now. Consider visiting tomorrow before 07:00.',
  },
};

const reports = [
  { time: '06:15', level: 'low', comment: 'Arrived early, in and out in 20 mins' },
  { time: '07:45', level: 'medium', comment: 'Queue was moving but took about an hour' },
  { time: '09:30', level: 'high', comment: 'Very long queue, arrived at 9 and waited 2.5 hrs' },
];

export default function QueuePage() {
  const [currentLevel, setCurrentLevel] = useState<QueueLevel>('medium');
  const [submitted, setSubmitted] = useState(false);
  const [selectedReport, setSelectedReport] = useState<QueueLevel | null>(null);

  const config = queueConfig[currentLevel];

  const handleReport = (level: QueueLevel) => {
    setSelectedReport(level);
  };

  const handleSubmit = () => {
    if (selectedReport) {
      setCurrentLevel(selectedReport);
      setSubmitted(true);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block bg-[#0EA5E9] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          Live Queue Intelligence
        </span>
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Queue Status</h1>
        <p className="text-gray-500 mt-2">
          See how busy Rossburgh DLTC is right now and plan your visit.
        </p>
      </div>

      {/* Current Status Card */}
      <div className={`rounded-2xl border-2 ${config.borderColor} ${config.bgColor} p-8 text-center mb-8`}>
        <div className="text-6xl mb-4">{config.emoji}</div>
        <h2 className={`text-3xl font-black ${config.textColor} mb-2`}>
          {config.label} Queue
        </h2>
        <p className="text-gray-600 text-lg mb-4">
          Estimated wait: <strong>{config.wait}</strong>
        </p>
        <p className={`text-sm font-medium ${config.textColor} bg-white px-4 py-2 rounded-full inline-block`}>
          {config.advice}
        </p>
      </div>

      {/* Best Times Panel */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h3 className="font-bold text-[#1E3A8A] text-lg mb-4">
          🕐 Best Times to Visit
        </h3>
        <div className="space-y-3">
          {[
            { time: '06:00 – 07:00', level: 'Quietest', color: 'bg-green-100 text-green-700' },
            { time: '07:00 – 09:00', level: 'Moderate', color: 'bg-yellow-100 text-yellow-700' },
            { time: '09:00 – 12:00', level: 'Busiest', color: 'bg-red-100 text-red-700' },
            { time: '12:00 – 14:00', level: 'Moderate', color: 'bg-yellow-100 text-yellow-700' },
            { time: '14:00 – 15:30', level: 'Quieter', color: 'bg-green-100 text-green-700' },
          ].map((slot) => (
            <div key={slot.time} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-700">{slot.time}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${slot.color}`}>
                {slot.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Report Queue Level */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h3 className="font-bold text-[#1E3A8A] text-lg mb-2">
          📢 Report Current Queue Level
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          Are you at the centre right now? Help others by reporting what you see.
        </p>

        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {(Object.keys(queueConfig) as QueueLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => handleReport(level)}
              className={`p-4 rounded-xl border-2 font-bold text-sm transition ${
                selectedReport === level
                  ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-[#1E3A8A]'
              }`}
            >
              <div className="text-2xl mb-1">{queueConfig[level].emoji}</div>
              {queueConfig[level].label}
            </button>
          ))}
        </div>

        {selectedReport && !submitted && (
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-[#1E3A8A] text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition"
          >
            Submit Report
          </button>
        )}

        {submitted && (
          <div className="mt-4 bg-green-50 border border-green-300 text-green-700 text-sm font-medium p-4 rounded-xl text-center">
            ✅ Thank you! Your queue report has been submitted.
          </div>
        )}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-bold text-[#1E3A8A] text-lg mb-4">
          🕓 Recent Reports Today
        </h3>
        <ul className="space-y-3">
          {reports.map((r, i) => (
            <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">{queueConfig[r.level as QueueLevel].emoji}</span>
              <div>
                <div className="text-xs text-gray-400 font-medium">{r.time}</div>
                <div className="text-sm text-gray-700">{r.comment}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </main>
  );
}