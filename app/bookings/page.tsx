'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';

export default function BookingsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
    const { user } = useAuth();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.fullName || !formData.email || !formData.service || !formData.date) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
  ...formData,
  userId: user?.uid || 'guest',
  status: 'pending',
  createdAt: serverTimestamp(),
});
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-10">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Submitted!</h2>
          <p className="text-green-700 text-sm mb-6">
            Your appointment request has been received. We will confirm via email shortly.
          </p>
          <div className="bg-white rounded-xl p-4 text-left text-sm text-gray-700 space-y-2 mb-6">
            <div><span className="font-semibold">Name:</span> {formData.fullName}</div>
            <div><span className="font-semibold">Service:</span> {formData.service}</div>
            <div><span className="font-semibold">Date:</span> {formData.date}</div>
            <div><span className="font-semibold">Time:</span> {formData.time}</div>
          </div>
          <button
            onClick={() => { setSubmitted(false); setFormData({ fullName: '', idNumber: '', email: '', phone: '', service: '', date: '', time: '', notes: '' }); }}
            className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition">
            Make Another Booking
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block bg-[#0EA5E9] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          Appointments
        </span>
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Book an Appointment</h1>
        <p className="text-gray-500 mt-2">Fill in the form below and we will confirm your booking.</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Personal Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input name="fullName" value={formData.fullName} onChange={handleChange}
              placeholder="e.g. Thabo Nkosi"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ID Number</label>
            <input name="idNumber" value={formData.idNumber} onChange={handleChange}
              placeholder="13-digit SA ID number"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
            <input name="email" type="email" value={formData.email} onChange={handleChange}
              placeholder="your@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange}
              placeholder="e.g. 071 000 0000"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" />
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Service Required <span className="text-red-500">*</span></label>
            <select name="service" value={formData.service} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" required>
              <option value="">Select a service...</option>
              <option value="Driver's Licence Renewal">Driver's Licence Renewal</option>
              <option value="Learner's Licence Test">Learner's Licence Test</option>
              <option value="Driver's Licence Test">Driver's Licence Test</option>
              <option value="PrDP Application">PrDP Application/Renewal</option>
              <option value="Licence Card Collection">Licence Card Collection</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date <span className="text-red-500">*</span></label>
              <input name="date" type="date" value={formData.date} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Time</label>
              <select name="time" value={formData.time} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]">
                <option value="">Select time...</option>
                <option value="07:30">07:30</option>
                <option value="08:00">08:00</option>
                <option value="08:30">08:30</option>
                <option value="09:00">09:00</option>
                <option value="09:30">09:30</option>
                <option value="10:00">10:00</option>
                <option value="10:30">10:30</option>
                <option value="11:00">11:00</option>
                <option value="11:30">11:30</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="14:30">14:30</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange}
              placeholder="Any special requirements or additional information..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] resize-none" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Booking Request'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            * Required fields. Operating hours: Mon–Fri 07:30–15:30
          </p>
        </form>
      </div>
    </main>
  );
}