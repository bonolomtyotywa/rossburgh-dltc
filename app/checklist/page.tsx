'use client';

import { useState } from 'react';

const checklistData = {
  renewal: {
    title: "Driver's Licence Renewal",
    icon: '🚗',
    estimatedTime: '2–3 hours',
    bestTime: 'Arrive before 07:00',
    documents: [
      { id: 1, name: 'Original South African ID card/book', required: true },
      { id: 2, name: 'Copy of ID', required: true },
      { id: 3, name: "Current driver's licence card", required: true },
      { id: 4, name: 'Proof of residence (not older than 3 months)', required: true },
      { id: 5, name: 'Eye test certificate (if done by optometrist)', required: false },
      { id: 6, name: 'Renewal fee payment method (bank card)', required: true },
    ],
  },
  prdp: {
    title: 'PrDP Application / Renewal',
    icon: '🪪',
    estimatedTime: '3–4 hours',
    bestTime: 'Arrive before 06:30',
    documents: [
      { id: 1, name: 'Original ID card/book', required: true },
      { id: 2, name: 'Copy of ID', required: true },
      { id: 3, name: "Valid driver's licence", required: true },
      { id: 4, name: 'Medical certificate (if required)', required: false },
      { id: 5, name: 'Proof of residence', required: true },
      { id: 6, name: 'Passport-sized photos (if required)', required: false },
      { id: 7, name: 'Application fee payment method', required: true },
    ],
  },
  testing: {
    title: "Driver's Licence Test Booking",
    icon: '📝',
    estimatedTime: '4–5 hours',
    bestTime: 'Arrive before 07:00',
    documents: [
      { id: 1, name: 'Original ID card/book', required: true },
      { id: 2, name: 'Copy of ID', required: true },
      { id: 3, name: "Valid learner's licence", required: true },
      { id: 4, name: 'Booking confirmation (if applicable)', required: false },
      { id: 5, name: 'Application fee payment method', required: true },
    ],
  },
  learners: {
    title: "Learner's Licence Test Booking",
    icon: '📖',
    estimatedTime: '2–3 hours',
    bestTime: 'Arrive before 07:00',
    documents: [
      { id: 1, name: 'Original South African ID card/book', required: true },
      { id: 2, name: 'Copy of ID (certified)', required: true },
      { id: 3, name: 'Completed application form (LL1)', required: true },
      { id: 4, name: 'Proof of residence (not older than 3 months)', required: true },
      { id: 5, name: 'Application fee payment method (bank card)', required: true },
      { id: 6, name: 'Booking confirmation (if pre-booked)', required: false },
      { id: 7, name: 'Study material / K53 handbook (for reference)', required: false },
    ],
  },
  collection: {
    title: 'Licence Card Collection',
    icon: '🔄',
    estimatedTime: '30–60 min',
    bestTime: 'Arrive before 08:00',
    documents: [
      { id: 1, name: 'Original ID card/book', required: true },
      { id: 2, name: 'Collection receipt / reference number', required: true },
      { id: 3, name: 'Temporary licence (if issued)', required: false },
    ],
  },
};

type ServiceKey = keyof typeof checklistData;

export default function ChecklistPage() {
  const [selected, setSelected] = useState<ServiceKey | null>(null);
  const [checked, setChecked] = useState<number[]>([]);

  const toggleCheck = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const service = selected ? checklistData[selected] : null;
  const requiredDocs = service?.documents.filter((d) => d.required) ?? [];
  const checkedRequired = requiredDocs.filter((d) => checked.includes(d.id));
  const allRequiredDone = checkedRequired.length === requiredDocs.length;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block bg-[#0EA5E9] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          Step 1 of your visit
        </span>
        <h1 className="text-3xl font-bold text-[#1E3A8A]">
          Document Checklist Generator
        </h1>
        <p className="text-gray-500 mt-2">
          Select your service below to see exactly what to bring.
        </p>
      </div>

      {/* Service Selector */}
      <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {(Object.keys(checklistData) as ServiceKey[]).map((key) => (
          <button
            key={key}
            onClick={() => { setSelected(key); setChecked([]); }}
            className={`p-4 rounded-xl border-2 text-left transition font-semibold ${
              selected === key
                ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-[#1E3A8A]'
            }`}
          >
            <div className="text-2xl mb-2">{checklistData[key].icon}</div>
            <div className="text-sm font-bold">{checklistData[key].title}</div>
          </button>
        ))}
      </div>

      {/* Prompt if nothing selected */}
      {!service && (
        <div className="mt-10 text-center p-10 bg-white rounded-2xl shadow border border-dashed border-gray-300">
          <div className="text-4xl mb-3">👆</div>
          <p className="text-gray-500 font-medium">
            Select a service above to generate your document checklist.
          </p>
        </div>
      )}

      {/* Checklist */}
      {service && (
        <div className="mt-10 bg-white rounded-2xl shadow p-6">

          {/* Service Title */}
          <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">
            {service.icon} {service.title}
          </h2>

          {/* Info Bar */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-blue-50 rounded-xl text-sm">
            <span>⏱ Estimated time: <strong>{service.estimatedTime}</strong></span>
            <span>🕐 Best time: <strong>{service.bestTime}</strong></span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span>
                {checkedRequired.length} / {requiredDocs.length} required documents
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#1E3A8A] h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    requiredDocs.length
                      ? (checkedRequired.length / requiredDocs.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Document List */}
          <ul className="space-y-3">
            {service.documents.map((doc) => (
              <li
                key={doc.id}
                onClick={() => toggleCheck(doc.id)}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  checked.includes(doc.id)
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                }`}
              >
                {/* Checkbox Circle */}
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    checked.includes(doc.id)
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-400'
                  }`}
                >
                  {checked.includes(doc.id) && (
                    <span className="text-xs">✓</span>
                  )}
                </div>

                {/* Document Name */}
                <div>
                  <span
                    className={`font-medium ${
                      checked.includes(doc.id)
                        ? 'line-through text-gray-400'
                        : 'text-gray-800'
                    }`}
                  >
                    {doc.name}
                  </span>
                  {!doc.required && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Status Message */}
          <div
            className={`mt-6 p-4 rounded-xl text-sm font-medium ${
              allRequiredDone
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-50 text-yellow-800'
            }`}
          >
            {allRequiredDone
              ? '✅ You have all required documents. You are ready to visit!'
              : `⚠️ You still need ${
                  requiredDocs.length - checkedRequired.length
                } required document(s) before visiting.`}
          </div>

          {/* Reset Button */}
          <button
            onClick={() => setChecked([])}
            className="mt-4 text-sm text-gray-400 hover:text-red-500 underline transition"
          >
            Reset checklist
          </button>
        </div>
      )}
    </main>
  );
}