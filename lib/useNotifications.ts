'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import {
  collection, query, orderBy, limit,
  onSnapshot, doc
} from 'firebase/firestore';
import { sendBrowserNotification } from '@/lib/notifications';

export function useAdminNotifications(loggedIn: boolean) {
  const prevBookingCount = useRef<number | null>(null);
  const prevFeedbackCount = useRef<number | null>(null);

  useEffect(() => {
    if (!loggedIn) return;

    // Watch new bookings
    const bq = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(50));
    const unsubB = onSnapshot(bq, (snap) => {
      if (prevBookingCount.current === null) {
        prevBookingCount.current = snap.size;
        return;
      }
      if (snap.size > prevBookingCount.current) {
        const newest = snap.docs[0].data();
        sendBrowserNotification(
          '📅 New Booking Received',
          `${newest.fullName} booked ${newest.service} on ${newest.date}`
        );
      }
      prevBookingCount.current = snap.size;
    });

    // Watch new feedback
    const fq = query(collection(db, 'feedback'), orderBy('submittedAt', 'desc'), limit(50));
    const unsubF = onSnapshot(fq, (snap) => {
      if (prevFeedbackCount.current === null) {
        prevFeedbackCount.current = snap.size;
        return;
      }
      if (snap.size > prevFeedbackCount.current) {
        const newest = snap.docs[0].data();
        sendBrowserNotification(
          '⭐ New Feedback Submitted',
          `${newest.name} rated ${newest.rating}/5 — "${newest.comment?.slice(0, 60)}"`
        );
      }
      prevFeedbackCount.current = snap.size;
    });

    return () => { unsubB(); unsubF(); };
  }, [loggedIn]);
}

export function useUserNotifications(userId: string | null) {
  const prevStatuses = useRef<Record<string, string>>({});
  const prevAnnouncementCount = useRef<number | null>(null);
  const prevQueueLevel = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Watch booking status changes
    const bq = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const unsubB = onSnapshot(bq, (snap) => {
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.userId !== userId) return;
        const prev = prevStatuses.current[d.id];
        if (prev && prev !== data.status) {
          if (data.status === 'confirmed') {
            sendBrowserNotification(
              '✅ Booking Confirmed!',
              `Your ${data.service} on ${data.date} has been confirmed.`
            );
          } else if (data.status === 'cancelled') {
            sendBrowserNotification(
              '❌ Booking Cancelled',
              `Your ${data.service} on ${data.date} was cancelled.`
            );
          }
        }
        prevStatuses.current[d.id] = data.status;
      });
    });

    // Watch new announcements
    const aq = query(
      collection(db, 'announcements'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const unsubA = onSnapshot(aq, (snap) => {
      if (prevAnnouncementCount.current === null) {
        prevAnnouncementCount.current = snap.size;
        return;
      }
      if (snap.size > prevAnnouncementCount.current) {
        const newest = snap.docs[0].data();
        sendBrowserNotification(
          '📢 New Announcement',
          `${newest.title} — ${newest.body?.slice(0, 80)}`
        );
      }
      prevAnnouncementCount.current = snap.size;
    });

    // Watch queue status changes
    const unsubQ = onSnapshot(doc(db, 'queue', 'current'), (snap) => {
      if (!snap.exists()) return;
      const level = snap.data().level;
      if (prevQueueLevel.current && prevQueueLevel.current !== level) {
        const emoji = level === 'low' ? '🟢' : level === 'medium' ? '🟡' : '🔴';
        sendBrowserNotification(
          `${emoji} Queue Status Updated`,
          `Rossburgh DLTC queue is now ${level.toUpperCase()}`
        );
      }
      prevQueueLevel.current = level;
    });

    return () => { unsubB(); unsubA(); unsubQ(); };
  }, [userId]);
}