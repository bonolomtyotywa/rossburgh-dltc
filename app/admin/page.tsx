'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import {
  collection, addDoc, deleteDoc, doc, getDoc,
  orderBy, query, serverTimestamp, onSnapshot, updateDoc, setDoc
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from 'firebase/auth';

interface Announcement {
  id: string;
  title: string;
  body: string;
  type: string;
  createdAt: unknown;
}

interface Feedback {
  id: string;
  name: string;
  rating: number;
  waitTime: string;
  comment: string;
  submittedAt: unknown;
}

interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: string;
  createdAt: unknown;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [queueLevel, setQueueLevel] = useState('low');
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newType, setNewType] = useState('info');
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string } | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) { setLoggedIn(false); setAuthChecking(false); return; }
      try {
        const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (!userSnap.exists() || userSnap.data().role !== 'admin') {
          await signOut(auth); setLoggedIn(false); setAuthChecking(false); return;
        }
        setLoggedIn(true);
      } catch { setLoggedIn(false); }
      setAuthChecking(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement)));
    });
    return () => unsub();
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;
    const q = query(collection(db, 'feedback'), orderBy('submittedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setFeedbackList(snap.docs.map(d => ({ id: d.id, ...d.data() } as Feedback)));
    });
    return () => unsub();
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;
    const unsub = onSnapshot(doc(db, 'queue', 'current'), (snap) => {
      if (snap.exists()) setQueueLevel(snap.data().level || 'low');
    });
    return () => unsub();
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
    });
    return () => unsub();
  }, [loggedIn]);

  const handleLogin = async () => {
    setLoginError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userSnap = await getDoc(doc(db, 'users', result.user.uid));
      if (!userSnap.exists() || userSnap.data().role !== 'admin') {
        await signOut(auth);
        setLoginError('Access denied. Admin accounts only.');
        return;
      }
    } catch { setLoginError('Incorrect email or password. Please try again.'); }
  };

  const handleLogout = async () => { await signOut(auth); setLoggedIn(false); };

  const handleAddAnnouncement = async () => {
    if (!newTitle || !newBody) return;
    setLoading(true);
    await addDoc(collection(db, 'announcements'), {
      title: newTitle, body: newBody, type: newType,
      createdAt: serverTimestamp(), active: true,
    });
    setNewTitle(''); setNewBody(''); setLoading(false);
  };

  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement) return;
    await updateDoc(doc(db, 'announcements', editingAnnouncement.id), {
      title: editingAnnouncement.title,
      body: editingAnnouncement.body,
      type: editingAnnouncement.type,
    });
    setEditingAnnouncement(null);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await deleteDoc(doc(db, 'announcements', id));
    setConfirmDelete(null);
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'bookings', id), { status });
  };

  const handleUpdateBooking = async () => {
    if (!editingBooking) return;
    await updateDoc(doc(db, 'bookings', editingBooking.id), {
      fullName: editingBooking.fullName,
      email: editingBooking.email,
      phone: editingBooking.phone,
      service: editingBooking.service,
      date: editingBooking.date,
      time: editingBooking.time,
      notes: editingBooking.notes,
      status: editingBooking.status,
    });
    setEditingBooking(null);
  };

  const handleDeleteBooking = async (id: string) => {
    await deleteDoc(doc(db, 'bookings', id));
    setConfirmDelete(null);
  };

  const handleDeleteFeedback = async (id: string) => {
    await deleteDoc(doc(db, 'feedback', id));
    setConfirmDelete(null);
  };

  const handleUpdateQueue = async (level: string) => {
    await setDoc(doc(db, 'queue', 'current'), {
      level, adminOverride: true, updatedAt: serverTimestamp(),
    });
    setQueueLevel(level);
  };

  const handleClearOverride = async () => {
    await setDoc(doc(db, 'queue', 'current'), {
      level: 'low', adminOverride: false, updatedAt: serverTimestamp(),
    });
    setQueueLevel('low');
  };

  const avgRating = feedbackList.length
    ? (feedbackList.reduce((a, b) => a + b.rating, 0) / feedbackList.length).toFixed(1)
    : '--';

  const statusColor = (status: string) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-700';
    if (status === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const typeColor = (type: string) => {
    if (type === 'success') return 'bg-green-100 text-green-700';
    if (type === 'warning') return 'bg-yellow-100 text-yellow-700';
    if (type === 'danger') return 'bg-red-100 text-red-700';
    return 'bg-blue-100 text-blue-700';
  };

  if (authChecking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  );

  if (!loggedIn) return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h1 className="text-2xl font-bold text-[#1E3A8A] mb-1">Admin Login</h1>
        <p className="text-gray-400 text-sm mb-6">Rossburgh DLTC Administration Panel</p>
        <input type="email" placeholder="Admin email" value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#1E3A8A]" />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#1E3A8A]" />
        {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
        <button onClick={handleLogin}
          className="w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition">
          Login to Admin Panel
        </button>
        <p className="text-xs text-gray-400 mt-3">For authorised personnel only</p>
      </div>
    </main>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Confirm Delete</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete this {confirmDelete.type}? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={() => {
                if (confirmDelete.type === 'announcement') handleDeleteAnnouncement(confirmDelete.id);
                if (confirmDelete.type === 'booking') handleDeleteBooking(confirmDelete.id);
                if (confirmDelete.type === 'feedback') handleDeleteFeedback(confirmDelete.id);
              }} className="flex-1 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {editingAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-[#1E3A8A] text-lg mb-4">Edit Announcement</h3>
            <select value={editingAnnouncement.type}
              onChange={e => setEditingAnnouncement({ ...editingAnnouncement, type: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#1E3A8A]">
              <option value="success">Normal</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="danger">Alert</option>
            </select>
            <input value={editingAnnouncement.title}
              onChange={e => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#1E3A8A]" />
            <textarea value={editingAnnouncement.body}
              onChange={e => setEditingAnnouncement({ ...editingAnnouncement, body: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:border-[#1E3A8A] resize-none" />
            <div className="flex gap-3">
              <button onClick={() => setEditingAnnouncement(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleUpdateAnnouncement}
                className="flex-1 py-2 rounded-xl bg-[#1E3A8A] text-white font-semibold hover:bg-blue-800">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-screen overflow-y-auto">
            <h3 className="font-bold text-[#1E3A8A] text-lg mb-4">Edit Booking</h3>
            <div className="space-y-3">
              <input value={editingBooking.fullName}
                onChange={e => setEditingBooking({ ...editingBooking, fullName: e.target.value })}
                placeholder="Full Name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" />
              <input value={editingBooking.email}
                onChange={e => setEditingBooking({ ...editingBooking, email: e.target.value })}
                placeholder="Email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" />
              <input value={editingBooking.phone}
                onChange={e => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                placeholder="Phone"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" />
              <select value={editingBooking.service}
                onChange={e => setEditingBooking({ ...editingBooking, service: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]">
                <option value="Driver's Licence Renewal">Driver's Licence Renewal</option>
                <option value="Learner's Licence Test">Learner's Licence Test</option>
                <option value="Driver's Licence Test">Driver's Licence Test</option>
                <option value="PrDP Application">PrDP Application/Renewal</option>
                <option value="Licence Card Collection">Licence Card Collection</option>
              </select>
              <input type="date" value={editingBooking.date}
                onChange={e => setEditingBooking({ ...editingBooking, date: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" />
              <input type="time" value={editingBooking.time}
                onChange={e => setEditingBooking({ ...editingBooking, time: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" />
              <select value={editingBooking.status}
                onChange={e => setEditingBooking({ ...editingBooking, status: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <textarea value={editingBooking.notes}
                onChange={e => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                placeholder="Notes" rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] resize-none" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditingBooking(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleUpdateBooking}
                className="flex-1 py-2 rounded-xl bg-[#1E3A8A] text-white font-semibold hover:bg-blue-800">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A8A]">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Rossburgh DLTC Management Panel</p>
        </div>
        <button onClick={handleLogout}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-200 transition">
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-2xl p-5 text-center">
          <div className="text-3xl font-black text-[#1E3A8A]">{announcements.length}</div>
          <div className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-wide">Announcements</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-5 text-center">
          <div className="text-3xl font-black text-green-700">{bookings.length}</div>
          <div className="text-xs font-bold text-green-600 mt-1 uppercase tracking-wide">Bookings</div>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-5 text-center">
          <div className="text-3xl font-black text-yellow-700 capitalize">{queueLevel}</div>
          <div className="text-xs font-bold text-yellow-600 mt-1 uppercase tracking-wide">Queue Status</div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-5 text-center">
          <div className="text-3xl font-black text-purple-700">{avgRating}★</div>
          <div className="text-xs font-bold text-purple-600 mt-1 uppercase tracking-wide">Avg Rating</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['dashboard', 'bookings', 'announcements', 'queue', 'feedback'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition ${
              activeTab === tab ? 'bg-[#1E3A8A] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1E3A8A]'
            }`}>
            {tab === 'dashboard' && '📊 '}{tab === 'bookings' && '📅 '}
            {tab === 'announcements' && '📢 '}{tab === 'queue' && '🚦 '}{tab === 'feedback' && '⭐ '}
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-[#1E3A8A] mb-3">📅 Recent Bookings</h3>
            {bookings.slice(0, 3).map(b => (
              <div key={b.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-semibold text-gray-800">{b.fullName}</div>
                  <div className="text-xs text-gray-400">{b.service} · {b.date}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${statusColor(b.status)}`}>{b.status}</span>
              </div>
            ))}
            {bookings.length === 0 && <p className="text-gray-400 text-sm">No bookings yet.</p>}
            <button onClick={() => setActiveTab('bookings')} className="mt-3 text-xs text-[#1E3A8A] font-semibold hover:underline">
              View all {bookings.length} bookings →
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-[#1E3A8A] mb-3">⭐ Recent Feedback</h3>
            {feedbackList.slice(0, 3).map(fb => (
              <div key={fb.id} className="py-2 border-b border-gray-50 last:border-0">
                <div className="flex justify-between">
                  <div className="text-sm font-semibold text-gray-800">{fb.name || 'Anonymous'}</div>
                  <div className="text-yellow-400 text-xs">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</div>
                </div>
                <div className="text-xs text-gray-400 truncate">{fb.comment}</div>
              </div>
            ))}
            {feedbackList.length === 0 && <p className="text-gray-400 text-sm">No feedback yet.</p>}
            <button onClick={() => setActiveTab('feedback')} className="mt-3 text-xs text-[#1E3A8A] font-semibold hover:underline">
              View all {feedbackList.length} reviews →
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-[#1E3A8A] mb-3">📊 Booking Summary</h3>
            {['pending', 'confirmed', 'cancelled'].map(status => (
              <div key={status} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600 capitalize">{status}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor(status)}`}>
                  {bookings.filter(b => b.status === status).length}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-[#1E3A8A] mb-3">🚦 Quick Queue Control</h3>
            <p className="text-sm text-gray-500 mb-3">Current: <span className="font-bold capitalize text-[#1E3A8A]">{queueLevel}</span></p>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map(level => (
                <button key={level} onClick={() => handleUpdateQueue(level)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition ${
                    queueLevel === level
                      ? level === 'low' ? 'bg-green-500 text-white' : level === 'medium' ? 'bg-yellow-400 text-white' : 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {level === 'low' ? '🟢' : level === 'medium' ? '🟡' : '🔴'} {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1E3A8A]">All Bookings ({bookings.length})</h2>
            <div className="flex gap-2 text-xs">
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">Pending: {bookings.filter(b => b.status === 'pending').length}</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Confirmed: {bookings.filter(b => b.status === 'confirmed').length}</span>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">Cancelled: {bookings.filter(b => b.status === 'cancelled').length}</span>
            </div>
          </div>
          {bookings.length === 0 ? <p className="text-gray-400 text-sm">No bookings yet.</p> : (
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{b.fullName}</div>
                      <div className="text-xs text-gray-500">{b.email} · {b.phone}</div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor(b.status)}`}>{b.status}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">{b.service}</span> · {b.date} {b.time && `at ${b.time}`}
                  </div>
                  {b.notes && <div className="text-xs text-gray-400 mb-3">📝 {b.notes}</div>}
                  <div className="flex flex-wrap gap-2">
                    {b.status !== 'confirmed' && (
                      <button onClick={() => updateBookingStatus(b.id, 'confirmed')}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold hover:bg-green-200 transition">✅ Confirm</button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button onClick={() => updateBookingStatus(b.id, 'cancelled')}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-full font-semibold hover:bg-red-200 transition">❌ Cancel</button>
                    )}
                    {b.status !== 'pending' && (
                      <button onClick={() => updateBookingStatus(b.id, 'pending')}
                        className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-semibold hover:bg-yellow-200 transition">⏳ Pending</button>
                    )}
                    <button onClick={() => setEditingBooking(b)}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold hover:bg-blue-200 transition">✏️ Edit</button>
                    <button onClick={() => setConfirmDelete({ type: 'booking', id: b.id })}
                      className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full font-semibold hover:bg-red-100 hover:text-red-600 transition">🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Post Announcement</h2>
          <select value={newType} onChange={e => setNewType(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#1E3A8A]">
            <option value="success">Normal</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="danger">Alert</option>
          </select>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Announcement title"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#1E3A8A]" />
          <textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Announcement message..." rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#1E3A8A] resize-none" />
          <button onClick={handleAddAnnouncement} disabled={loading || !newTitle || !newBody}
            className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition disabled:opacity-50">
            {loading ? 'Posting...' : 'Post Announcement'}
          </button>
          <div className="mt-6 space-y-3">
            <h3 className="font-bold text-gray-700 text-sm">Posted Announcements ({announcements.length})</h3>
            {announcements.map(a => (
              <div key={a.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="font-semibold text-gray-800 text-sm">{a.title}</div>
                <div className="text-xs text-gray-500 mt-1">{a.body}</div>
                <span className={`text-xs font-bold mt-2 inline-block px-2 py-0.5 rounded-full ${typeColor(a.type)}`}>{a.type}</span>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setEditingAnnouncement(a)}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold hover:bg-blue-200 transition">✏️ Edit</button>
                  <button onClick={() => setConfirmDelete({ type: 'announcement', id: a.id })}
                    className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full font-semibold hover:bg-red-100 hover:text-red-600 transition">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queue Tab */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-[#1E3A8A] mb-2">Update Queue Status</h2>
          <p className="text-gray-500 text-sm mb-6">Current: <span className="font-bold capitalize text-[#1E3A8A]">{queueLevel}</span></p>
          <div className="flex gap-3 mb-4">
            {['low', 'medium', 'high'].map(level => (
              <button key={level} onClick={() => handleUpdateQueue(level)}
                className={`flex-1 py-4 rounded-xl font-bold capitalize text-sm transition ${
                  queueLevel === level
                    ? level === 'low' ? 'bg-green-500 text-white' : level === 'medium' ? 'bg-yellow-400 text-white' : 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {level === 'low' ? '🟢' : level === 'medium' ? '🟡' : '🔴'} {level}
              </button>
            ))}
          </div>
          <button onClick={handleClearOverride}
            className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition">
            🤖 Clear Override — Use Automatic Mode
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">Automatic mode sets queue based on time of day</p>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1E3A8A]">User Feedback ({feedbackList.length} reviews)</h2>
            {feedbackList.length > 0 && (
              <span className="text-sm text-gray-500">Avg: <span className="font-bold text-[#1E3A8A]">{avgRating}★</span></span>
            )}
          </div>
          <div className="space-y-4">
            {feedbackList.length === 0 && <p className="text-gray-400 text-sm">No feedback yet.</p>}
            {feedbackList.map(fb => (
              <div key={fb.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-semibold text-gray-800 text-sm">{fb.name || 'Anonymous'}</div>
                  <div className="text-yellow-400 text-sm">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</div>
                </div>
                <div className="text-xs text-gray-400 mb-2">Wait: {fb.waitTime}</div>
                <p className="text-sm text-gray-600 mb-3">{fb.comment}</p>
                <button onClick={() => setConfirmDelete({ type: 'feedback', id: fb.id })}
                  className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full font-semibold hover:bg-red-100 hover:text-red-600 transition">
                  🗑️ Delete Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}
