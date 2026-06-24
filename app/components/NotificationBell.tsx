'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import { requestNotificationPermission } from '@/lib/notifications';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: Date;
  read: boolean;
  type: string;
}

export default function NotificationBell() {
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [permissionAsked, setPermissionAsked] = useState(false);
  const prevCounts = useRef<Record<string, number>>({});
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;

  // Request browser permission on first interaction
  useEffect(() => {
    if (!user || permissionAsked) return;
    setPermissionAsked(true);
    requestNotificationPermission();
  }, [user, permissionAsked]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Watch announcements for all logged-in users
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'announcements'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const unsub = onSnapshot(q, (snap) => {
      const prev = prevCounts.current['announcements'] ?? snap.size;
      if (snap.size > prev) {
        const newest = snap.docs[0].data();
        const item: NotificationItem = {
          id: `ann-${snap.docs[0].id}`,
          title: '📢 New Announcement',
          body: newest.title,
          time: newest.createdAt?.toDate() || new Date(),
          read: false,
          type: 'announcement',
        };
        setNotifications(prev => [item, ...prev].slice(0, 20));
      }
      prevCounts.current['announcements'] = snap.size;
    });
    return () => unsub();
  }, [user]);

  // Watch booking status for regular users
  useEffect(() => {
    if (!user || role === 'admin') return;
    const prevStatuses: Record<string, string> = {};
    const q = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const unsub = onSnapshot(q, (snap) => {
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.userId !== user.uid) return;
        const prev = prevStatuses[d.id];
        if (prev && prev !== data.status) {
          const item: NotificationItem = {
            id: `booking-${d.id}-${data.status}`,
            title: data.status === 'confirmed' ? '✅ Booking Confirmed!' : '❌ Booking Cancelled',
            body: `${data.service} on ${data.date}`,
            time: new Date(),
            read: false,
            type: 'booking',
          };
          setNotifications(prev => [item, ...prev].slice(0, 20));
        }
        prevStatuses[d.id] = data.status;
      });
    });
    return () => unsub();
  }, [user, role]);

  // Watch new bookings & feedback for admin
  useEffect(() => {
    if (!user || role !== 'admin') return;

    const bq = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(50));
    const unsubB = onSnapshot(bq, (snap) => {
      const prev = prevCounts.current['bookings'] ?? snap.size;
      if (snap.size > prev) {
        const newest = snap.docs[0].data();
        const item: NotificationItem = {
          id: `book-${snap.docs[0].id}`,
          title: '📅 New Booking',
          body: `${newest.fullName} — ${newest.service}`,
          time: new Date(),
          read: false,
          type: 'booking',
        };
        setNotifications(prev => [item, ...prev].slice(0, 20));
      }
      prevCounts.current['bookings'] = snap.size;
    });

    const fq = query(collection(db, 'feedback'), orderBy('submittedAt', 'desc'), limit(50));
    const unsubF = onSnapshot(fq, (snap) => {
      const prev = prevCounts.current['feedback'] ?? snap.size;
      if (snap.size > prev) {
        const newest = snap.docs[0].data();
        const item: NotificationItem = {
          id: `feed-${snap.docs[0].id}`,
          title: '⭐ New Feedback',
          body: `${newest.name} rated ${newest.rating}/5`,
          time: new Date(),
          read: false,
          type: 'feedback',
        };
        setNotifications(prev => [item, ...prev].slice(0, 20));
      }
      prevCounts.current['feedback'] = snap.size;
    });

    return () => { unsubB(); unsubF(); };
  }, [user, role]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        className="relative p-2 rounded-full hover:bg-blue-700 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-[#1E3A8A] text-sm">Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={markAllRead} className="text-xs text-gray-400 hover:text-gray-600">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                <div className="text-3xl mb-2">🔔</div>
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id}
                  className={`px-4 py-3 border-b border-gray-50 last:border-0 ${!n.read ? 'bg-blue-50' : ''}`}>
                  <div className="font-semibold text-sm text-gray-800">{n.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{n.body}</div>
                  <div className="text-xs text-gray-300 mt-1">
                    {n.time.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}