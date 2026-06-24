'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection, addDoc, query, orderBy,
  onSnapshot, serverTimestamp, limit
} from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';

type Rating = 1 | 2 | 3 | 4 | 5;

const ratingLabels: Record<Rating, string> = {
  1: 'Very Poor', 2: 'Poor', 3: 'Average', 4: 'Good', 5: 'Excellent',
};

const ratingColors: Record<Rating, string> = {
  1: 'text-red-500', 2: 'text-orange-500', 3: 'text-yellow-500',
  4: 'text-blue-500', 5: 'text-green-500',
};

interface FeedbackItem {
  id: string;
  name: string;
  rating: number;
  waitTime: string;
  comment: string;
  submittedAt: { toDate: () => Date } | null;
}

export default function FeedbackPage() {
  const [rating, setRating] = useState<Rating | null>(null);
  const [hoveredRating, setHoveredRating] = useState<Rating | null>(null);
  const [waitTime, setWaitTime] = useState('');
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'feedback'),
      orderBy('submittedAt', 'desc'),
      limit(20)
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as FeedbackItem));
      setFeedbackList(items);
      setReviewCount(items.length);
      if (items.length > 0) {
        const avg = items.reduce((a, b) => a + b.rating, 0) / items.length;
        setAvgRating(Math.round(avg * 10) / 10);
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    await addDoc(collection(db, 'feedback'), {
  name: name || user?.displayName || 'Anonymous',
  userId: user?.uid || 'guest',
  rating,
  waitTime,
  comment,
  submittedAt: serverTimestamp(),
});
    setSubmitted(true);
    setLoading(false);
  };

  const displayRating = hoveredRating ?? rating;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block bg-[#0EA5E9] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          Community Feedback
        </span>
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Share Your Experience</h1>
        <p className="text-gray-500 mt-2">Help others plan their visit by sharing how your experience was.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 mb-10" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <div className="text-3xl font-black text-[#1E3A8A]">{avgRating || '—'}</div>
          <div className="text-sm text-gray-500 mt-1">Avg Rating</div>
          <div className="text-yellow-400 text-lg mt-1">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <div className="text-3xl font-black text-[#1E3A8A]">{reviewCount}</div>
          <div className="text-sm text-gray-500 mt-1">Total Reviews</div>
          <div className="text-2xl mt-1">💬</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <div className="text-3xl font-black text-[#1E3A8A]">Live</div>
          <div className="text-sm text-gray-500 mt-1">Real-time data</div>
          <div className="text-2xl mt-1">🔴</div>
        </div>
      </div>

      {/* Form */}
      {!submitted ? (
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <h2 className="text-xl font-bold text-[#1E3A8A] mb-6">Rate Your Visit</h2>

          {/* Name */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your name (optional)</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Thabo N."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>

          {/* Stars */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Overall Experience</label>
            <div className="flex gap-3">
              {([1, 2, 3, 4, 5] as Rating[]).map(star => (
                <button key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className={`text-4xl transition-transform hover:scale-110 ${
                    displayRating && star <= displayRating ? 'text-yellow-400' : 'text-gray-200'
                  }`}>★</button>
              ))}
            </div>
            {displayRating && (
              <p className={`text-sm font-semibold mt-2 ${ratingColors[displayRating]}`}>
                {ratingLabels[displayRating]}
              </p>
            )}
          </div>

          {/* Wait Time */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">How long did you wait?</label>
            <div className="grid grid-cols-4 gap-2">
              {['< 30 min', '30–60 min', '1–2 hrs', '2+ hrs'].map(option => (
                <button key={option} onClick={() => setWaitTime(option)}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition ${
                    waitTime === option
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#1E3A8A]'
                  }`}>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Any comments? (optional)</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience to help others..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:border-[#1E3A8A] resize-none"
            />
          </div>

          <button onClick={handleSubmit} disabled={!rating || loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition ${
              rating ? 'bg-[#1E3A8A] hover:bg-blue-800' : 'bg-gray-300 cursor-not-allowed'
            }`}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
          {!rating && <p className="text-xs text-gray-400 text-center mt-2">Please select a star rating</p>}
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 text-center mb-10">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-green-800 mb-2">Thank you for your feedback!</h2>
          <p className="text-green-700 text-sm">Your review helps others plan their visit to Rossburgh DLTC.</p>
          <button onClick={() => { setSubmitted(false); setRating(null); setWaitTime(''); setComment(''); setName(''); }}
            className="mt-4 text-sm text-green-600 underline hover:text-green-800">
            Submit another review
          </button>
        </div>
      )}

      {/* Recent Reviews */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-[#1E3A8A] mb-6">Recent Visitor Reviews</h2>
        {feedbackList.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {feedbackList.map(fb => {
              const initials = fb.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
              const date = fb.submittedAt?.toDate();
              return (
                <div key={fb.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center">
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{fb.name || 'Anonymous'}</div>
                        <div className="text-xs text-gray-400">
                          {fb.waitTime && `Waited ${fb.waitTime}`}
                          {date && ` · ${date.toLocaleDateString('en-ZA')}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-yellow-400 text-sm">
                      {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                    </div>
                  </div>
                  {fb.comment && <p className="text-sm text-gray-600 leading-relaxed">{fb.comment}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}