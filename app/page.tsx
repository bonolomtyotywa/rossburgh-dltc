import Link from 'next/link';

const features = [
  {
    icon: '📋',
    title: 'Document Checklist',
    desc: 'Know exactly what to bring before you leave home.',
    href: '/checklist',
    color: 'border-blue-500',
  },
  {
    icon: '🟢',
    title: 'Queue Status',
    desc: 'See how busy the centre is right now.',
    href: '/queue',
    color: 'border-green-500',
  },
  {
    icon: '📢',
    title: 'Live Updates',
    desc: 'Check for closures, delays and system issues.',
    href: '/updates',
    color: 'border-yellow-500',
  },
  {
    icon: '💰',
    title: 'Fees & Costs',
    desc: 'Calculate renewal and PrDP fees instantly.',
    href: '/services',
    color: 'border-purple-500',
  },
  {
    icon: '📄',
    title: 'Forms & Downloads',
    desc: 'Access all official application forms in one place.',
    href: '/services',
    color: 'border-orange-500',
  },
  {
    icon: '📍',
    title: 'Location & Directions',
    desc: 'Get directions, parking tips and transport info.',
    href: '/location',
    color: 'border-red-500',
  },
];

export default function HomePage() {
  return (
    <main>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E3A8A] to-[#1e4fd9] text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-[#0EA5E9] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Durban · KwaZulu-Natal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Visit Rossburgh DLTC <br />
            <span className="text-[#0EA5E9]">Without the Stress</span>
          </h1>
          <p className="mt-4 text-lg text-blue-200 max-w-xl mx-auto">
            Check documents, track queues, download forms and plan your visit —
            all in one place.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checklist"
              className="bg-white text-[#1E3A8A] font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              📋 Check My Documents
            </Link>
            <Link
              href="/queue"
              className="border border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white hover:text-[#1E3A8A] transition"
            >
              🟢 View Queue Status
            </Link>
          </div>
        </div>
      </section>

      {/* Status Banner */}
      <div className="bg-green-600 text-white text-center py-3 px-4 text-sm font-medium">
        ✅ Centre is currently <strong>OPEN</strong> &nbsp;|&nbsp;
        🕐 Operating Hours: Mon–Fri 07:30–15:30 &nbsp;|&nbsp;
        Estimated wait today: <strong>~45 min</strong>
      </div>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1E3A8A] text-center mb-2">
          Everything You Need
        </h2>
        <p className="text-gray-500 text-center mb-10">
          Use the tools below to plan a smooth, hassle-free visit.
        </p>
        <div className="grid gap-6" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className={`bg-white rounded-xl shadow hover:shadow-md p-6 border-l-4 ${f.color} transition hover:-translate-y-1 duration-200 block`}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 text-lg">{f.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Step by Step Section */}
      <section className="bg-[#1E3A8A] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            What Happens When You Arrive?
          </h2>
          <p className="text-blue-200 mb-10">
            Follow these steps so you know exactly what to expect on the day.
          </p>
          <div className="grid gap-4 text-sm" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
            {[
              { step: '1', label: 'Join entrance queue',     tip: 'Arrive before 07:00 for shortest waits' },
              { step: '2', label: 'Document verification',   tip: 'Have originals AND copies ready' },
              { step: '3', label: 'Payment counter',         tip: 'Cash or card accepted' },
              { step: '4', label: 'Submission & processing', tip: 'Temporary licence may be issued same day' },
            ].map((item) => (
              <div key={item.step} className="bg-white/10 rounded-xl p-4 text-left">
                <div className="text-[#0EA5E9] font-black text-2xl mb-1">0{item.step}</div>
                <div className="font-semibold">{item.label}</div>
                <div className="text-blue-300 text-xs mt-1">{item.tip}</div>
              </div>
            ))}
          </div>
          <Link
            href="/checklist"
            className="inline-block mt-10 bg-[#0EA5E9] hover:bg-blue-400 text-white font-bold px-8 py-3 rounded-lg transition"
          >
            Start Planning My Visit →
          </Link>
        </div>
      </section>

    </main>
  );
}