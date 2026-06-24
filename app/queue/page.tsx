'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

type QueueLevel = 'low' | 'medium' | 'high';

const queueConfig = {
  low: {
    emoji: '🟢',
    label: 'Low Queue',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    wait: '15–30 minutes',
    advice: 'Great time to visit! Queues are short right now.',
  },
  medium: {
    emoji: '🟡',
    label: 'Medium Queue',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    wait: '45–90 minutes',
    advice: 'Moderate queues. Arrive early and have documents ready.',
  },
  high: {
    emoji: '🔴',
    label: 'High Queue',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    wait: '2–3 hours',
    advice: 'Very busy right now. Consider visiting tomorrow before 07:00.',
  },
};

function getAutoQueueLevel(): QueueLevel {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour + minute / 60;

  // Closed on weekends
  if (day === 0 || day === 6) return 'low';

  // Operating hours: 07:30 – 15:30
  if (time < 6 || time >= 15.5) return 'low';
  if (time >= 6 && time < 7) return 'low';
  if (time >= 7 && time < 9) return 'medium';
  if (time >= 9 && time < 13) return 'high';
  if (time >= 13 && time < 15.5) return 'medium';

  return 'low';
}

export default function QueuePage() {
  const [adminLevel, setAdminLevel] = useState<QueueLevel | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Listen to admin override from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'queue', 'current'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setAdminLevel(data.adminOverride ? (data.level as QueueLevel) : null);
        setUpdatedAt(data.updatedAt?.toDate() || null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const autoLevel = getAutoQueueLevel();
  const level = adminLevel ?? autoLevel;
  const config = queueConfig[level];
  const isOverridden = adminLevel !== null;

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

      {/* Status Card */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading queue status...</div>
      ) : (
        <div className={`rounded-2xl border-2 ${config.borderColor} ${config.bgColor} p-8 text-center mb-8`}>
          <div className="text-6xl mb-4">{config.emoji}</div>
          <h2 className={`text-3xl font-black ${config.textColor} mb-2`}>{config.label}</h2>
          <p className="text-gray-600 text-lg mb-4">
            Estimated wait: <strong>{config.wait}</strong>
          </p>
          <p className={`text-sm font-medium ${config.textColor} bg-white px-4 py-2 rounded-full inline-block`}>
            {config.advice}
          </p>
          <div className="mt-4 space-y-1">
            {isOverridden && updatedAt && (
              <p className="text-xs text-orange-500 font-semibold">
                ⚡ Admin override active · set at {updatedAt.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
            {!isOverridden && (
              <p className="text-xs text-gray-400">
                🤖 Auto-calculated based on time of day
              </p>
            )}
            <p className="text-xs text-gray-400">
              🕐 Current time: {currentTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      )}

      {/* Best Times Panel */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h3 className="font-bold text-[#1E3A8A] text-lg mb-4">🕐 Best Times to Visit</h3>
        <div className="space-y-3">
          {[
            { time: '06:00 – 07:00', label: 'Quietest', color: 'bg-green-100 text-green-700' },
            { time: '07:00 – 09:00', label: 'Moderate', color: 'bg-yellow-100 text-yellow-700' },
            { time: '09:00 – 13:00', label: 'Busy', color: 'bg-orange-100 text-orange-700' },
            { time: '13:00 – 15:30', label: 'Moderate', color: 'bg-yellow-100 text-yellow-700' },
            { time: 'After 15:30', label: 'Closed', color: 'bg-gray-100 text-gray-500' },
          ].map(({ time, label, color }) => (
            <div key={time} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{time}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${color}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-[#1E3A8A] text-white rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-3">💡 Tips to Save Time</h3>
        <ul className="space-y-2 text-sm text-blue-100">
          <li>✅ Arrive before 07:00 for shortest queues</li>
          <li>✅ Have all documents ready before joining the queue</li>
          <li>✅ Bring exact change or a bank card for fees</li>
          <li>✅ Check Live Updates before leaving home</li>
          <li>⚠️ Avoid month-end periods — queues are much longer</li>
        </ul>
      </div>

    </main>
  );
}