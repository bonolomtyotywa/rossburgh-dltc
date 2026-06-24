'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection, query, where, onSnapshot, orderBy
} from 'firebase/firestore';
import { logoutUser } from '@/lib/auth';

interface Booking {
  id: string;
  fullName: string;
  service: string;
  date: string;
  time: string;
  status: string;
  createdAt: unknown;
}

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  waitTime: string;
  submittedAt: unknown;
}

export default function DashboardPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
  if (loading) return;
  if (!user) { router.push('/login'); return; }
  if (role === 'admin') { router.push('/admin'); return; }
}, [user, role, loading, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'feedback'),
      where('userId', '==', user.uid),
      orderBy('submittedAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setFeedbackList(snap.docs.map(d => ({ id: d.id, ...d.data() } as Feedback)));
    });
    return () => unsub();
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  );

  const statusColor = (status: string) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-700';
    if (status === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A8A]">My Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back, {user?.displayName || user?.email}
          </p>
        </div>
        <button onClick={() => { logoutUser(); router.push('/'); }}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-200 transition text-sm">
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-2xl p-5 text-center">
          <div className="text-3xl font-black text-[#1E3A8A]">{bookings.length}</div>
          <div className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-wide">My Bookings</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-5 text-center">
          <div className="text-3xl font-black text-green-700">
            {bookings.filter(b => b.status === 'confirmed').length}
          </div>
          <div className="text-xs font-bold text-green-600 mt-1 uppercase tracking-wide">Confirmed</div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-5 text-center">
          <div className="text-3xl font-black text-purple-700">{feedbackList.length}</div>
          <div className="text-xs font-bold text-purple-600 mt-1 uppercase tracking-wide">My Reviews</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={() => router.push('/bookings')}
          className="bg-[#1E3A8A] text-white rounded-2xl p-5 text-left hover:bg-blue-800 transition">
          <div className="text-2xl mb-2">📅</div>
          <div className="font-bold">Book Appointment</div>
          <div className="text-blue-200 text-sm">Schedule a new visit</div>
        </button>
        <button onClick={() => router.push('/checklist')}
          className="bg-[#0EA5E9] text-white rounded-2xl p-5 text-left hover:bg-blue-400 transition">
          <div className="text-2xl mb-2">📋</div>
          <div className="font-bold">Document Checklist</div>
          <div className="text-blue-100 text-sm">Check what to bring</div>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['bookings', 'feedback'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition ${
              activeTab === tab
                ? 'bg-[#1E3A8A] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1E3A8A]'
            }`}>
            {tab === 'bookings' ? '📅 My Bookings' : '⭐ My Reviews'}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-gray-400 text-sm">No bookings yet.</p>
              <button onClick={() => router.push('/bookings')}
                className="mt-4 bg-[#1E3A8A] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-800 transition">
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-gray-800">{b.service}</div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    📅 {b.date} {b.time && `at ${b.time}`}
                  </div>
                  {b.status === 'pending' && (
                    <p className="text-xs text-yellow-600 mt-2">
                      ⏳ Awaiting confirmation from Rossburgh DLTC
                    </p>
                  )}
                  {b.status === 'confirmed' && (
                    <p className="text-xs text-green-600 mt-2">
                      ✅ Your appointment is confirmed!
                    </p>
                  )}
                  {b.status === 'cancelled' && (
                    <p className="text-xs text-red-600 mt-2">
                      ❌ This booking was cancelled.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">My Reviews</h2>
          {feedbackList.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">⭐</div>
              <p className="text-gray-400 text-sm">You haven't submitted any reviews yet.</p>
              <button onClick={() => router.push('/feedback')}
                className="mt-4 bg-[#1E3A8A] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-800 transition">
                Leave a Review
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbackList.map(fb => (
                <div key={fb.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-yellow-400">
                      {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                    </div>
                    <div className="text-xs text-gray-400">Wait: {fb.waitTime}</div>
                  </div>
                  {fb.comment && <p className="text-sm text-gray-600">{fb.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </main>
  );
}