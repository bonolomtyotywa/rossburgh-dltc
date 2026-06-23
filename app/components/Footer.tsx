export default function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">

        <div>
          <h3 className="font-bold text-[#0EA5E9] mb-3 text-base">Rossburgh DLTC</h3>
          <p className="text-blue-200 leading-relaxed">
            Helping residents of KwaZulu-Natal plan stress-free visits to the
            Rossburgh Driver's Licence Testing Centre.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-[#0EA5E9] mb-3 text-base">Quick Links</h3>
          <ul className="space-y-2 text-blue-200">
            <li><a href="/checklist" className="hover:text-white">Document Checklist</a></li>
            <li><a href="/queue" className="hover:text-white">Queue Status</a></li>
            <li><a href="/updates" className="hover:text-white">Live Updates</a></li>
            <li><a href="/location" className="hover:text-white">Location & Directions</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-[#0EA5E9] mb-3 text-base">Contact</h3>
          <ul className="space-y-2 text-blue-200">
            <li>📍 Rossburgh, Durban, KZN</li>
            <li>🕐 Mon–Fri: 07:30 – 15:30</li>
            <li>📞 031 000 0000</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-800 text-center text-blue-300 text-xs py-4">
        © {new Date().getFullYear()} Rossburgh DLTC Portal. For informational purposes only.
      </div>
    </footer>
  );
}