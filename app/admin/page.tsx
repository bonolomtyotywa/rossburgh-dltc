'use client';

import { useState } from 'react';

type AnnouncementType = 'info' | 'warning' | 'danger' | 'success';

interface Announcement {
  id: number;
  type: AnnouncementType;
  title: string;
  message: string;
  date: string;
}

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    type: 'success',
    title: 'Centre is Open',
    message: 'Rossburgh DLTC is operating normally today.',
    date: '2026-06-23',
  },
  {
    id: 2,
    type: 'warning',
    title: 'High Volume Expected',
    message: 'Due to month-end, queues are expected to be longer than usual.',
    date: '2026-06-23',
  },
  {
    id: 3,
    type: 'danger',
    title: 'Load Shedding Alert',
    message: 'Stage 4 load shedding scheduled today. Delays expected.',
    date: '2026-06-22',
  },
];

const feedbackData = [
  { name: 'Thabo N.', rating: 4, wait: '45 min', comment: 'Staff were helpful.', date: 'Today' },
  { name: 'Priya M.', rating: 3, wait: '2 hrs', comment: 'Long wait but expected.', date: 'Today' },
  { name: 'Sipho Z.', rating: 5, wait: '20 min', comment: 'Arrived early, very fast.', date: 'Yesterday' },
  { name: 'Nomsa B.', rating: 2, wait: '3 hrs', comment: 'System was down causing delays.', date: 'Yesterday' },
];

const queueReports = [
  { time: '06:15', level: 'Low', emoji: '🟢', comment: 'Very quiet at opening.' },
  { time: '07:45', level: 'Medium', emoji: '🟡', comment: 'Queue building up.' },
  { time: '09:30', level: 'High', emoji: '🔴', comment: 'Very busy, long wait.' },
  { time: '11:00', level: 'High', emoji: '🔴', comment: 'Still very busy.' },
  { time: '13:30', level: 'Medium', emoji: '🟡', comment: 'Quieter after lunch.' },
];

const typeConfig = {
  success: { label: 'Normal', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  warning: { label: 'Warning', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  danger:  { label: 'Alert',   bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300'    },
  info:    { label: 'Info',    bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-300'   },
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState<AnnouncementType>('info');
  const [posted, setPosted] = useState(false);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handlePost = () => {
    if (!newTitle || !newMessage) return;
    const newAnnouncement: Announcement = {
      id: Date.now(),
      type: newType,
      title: newTitle,
      message: newMessage,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setNewTitle('');
    setNewMessage('');
    setNewType('info');
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-2xl font-bold text-[#1E3A8A]">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-1">
              Rossburgh DLTC Administration Panel
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full bg-[#1E3A8A] text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition"
          >
            Login to Admin Panel
          </button>
          <p className="text-xs text-gray-400 text-center mt-4">
            For authorised personnel only
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A8A]">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Rossburgh DLTC Management Panel</p>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="bg-red-100 text-red-600 font-bold px-4 py-2 rounded-xl hover:bg-red-200 transition text-sm"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Announcements', value: announcements.length, icon: '📢', color: 'bg-blue-50 text-blue-700' },
          { label: 'Feedback Today', value: feedbackData.filter(f => f.date === 'Today').length, icon: '💬', color: 'bg-green-50 text-green-700' },
          { label: 'Queue Reports', value: queueReports.length, icon: '🟡', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Avg Rating', value: '3.5★', icon: '⭐', color: 'bg-purple-50 text-purple-700' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl p-5 ${stat.color} text-center`}>
            <div className="text-3xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-black">{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-wide mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {[
          { key: 'dashboard',      label: '📊 Dashboard'      },
          { key: 'announcements',  label: '📢 Announcements'  },
          { key: 'feedback',       label: '💬 Feedback'       },
          { key: 'queue',          label: '🟡 Queue Reports'  },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition ${
              activeTab === tab.key
                ? 'bg-[#1E3A8A] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1E3A8A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-[#1E3A8A] text-lg mb-4">Recent Announcements</h2>
            <ul className="space-y-3">
              {announcements.slice(0, 3).map((a) => (
                <li key={a.id} className={`p-3 rounded-xl border ${typeConfig[a.type].bg} ${typeConfig[a.type].border}`}>
                  <div className={`font-bold text-sm ${typeConfig[a.type].text}`}>{a.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{a.date}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-[#1E3A8A] text-lg mb-4">Recent Feedback</h2>
            <ul className="space-y-3">
              {feedbackData.slice(0, 3).map((f, i) => (
                <li key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between">
                    <span className="font-bold text-sm text-gray-800">{f.name}</span>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(f.rating)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{f.comment}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-[#1E3A8A] text-lg mb-4">Post New Announcement</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(typeConfig) as AnnouncementType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
                      newType === t
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {typeConfig[t].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Announcement title"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your announcement here..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] resize-none"
              />
            </div>
            <button
              onClick={handlePost}
              disabled={!newTitle || !newMessage}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                newTitle && newMessage
                  ? 'bg-[#1E3A8A] hover:bg-blue-800'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Post Announcement
            </button>
            {posted && (
              <div className="mt-3 bg-green-50 border border-green-300 text-green-700 text-sm p-3 rounded-xl text-center">
                Announcement posted successfully!
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-[#1E3A8A] text-lg mb-4">
              Manage Announcements ({announcements.length})
            </h2>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className={`flex items-start justify-between p-4 rounded-xl border ${typeConfig[a.type].bg} ${typeConfig[a.type].border}`}
                >
                  <div>
                    <div className={`font-bold ${typeConfig[a.type].text}`}>{a.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{a.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{a.date}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="ml-4 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-lg hover:bg-red-200 transition flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-bold text-[#1E3A8A] text-lg mb-6">
            User Feedback ({feedbackData.length} reviews)
          </h2>
          <div className="space-y-4">
            {feedbackData.map((f, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-gray-800">{f.name}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">Wait: {f.wait}</span>
                    <span className="text-yellow-400">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                    <span className="text-xs text-gray-400">{f.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{f.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-bold text-[#1E3A8A] text-lg mb-6">
            Queue Reports Today ({queueReports.length} reports)
          </h2>
          <div className="space-y-3">
            {queueReports.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-2xl">{r.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-sm">{r.time}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      r.level === 'Low' ? 'bg-green-100 text-green-700' :
                      r.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {r.level}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{r.comment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}