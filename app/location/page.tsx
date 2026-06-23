export default function LocationPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Location and Directions</h1>
        <p className="text-gray-500 mt-2">Find and get to Rossburgh DLTC.</p>
      </div>
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="font-bold text-[#1E3A8A] text-lg mb-4">Address</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Rossburgh Driver Licence Testing Centre<br />
          Combine Road and Barons Walk<br />
          Rossburgh, Durban, 4094<br />
          KwaZulu-Natal, South Africa
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="font-bold text-[#1E3A8A] text-lg mb-4">Operating Hours</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between"><span>Monday to Friday</span><span className="font-semibold text-green-600">07:30 - 15:30</span></li>
          <li className="flex justify-between"><span>Saturday</span><span className="font-semibold text-red-500">Closed</span></li>
          <li className="flex justify-between"><span>Sunday</span><span className="font-semibold text-red-500">Closed</span></li>
        </ul>
      </div>
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="font-bold text-[#1E3A8A] text-lg mb-4">Getting There</h2>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-3"><span>🚗</span><div><div className="font-semibold">By Car</div><div className="text-gray-500">Take the M4 south towards Rossburgh. Turn onto Combine Rd.</div></div></li>
          <li className="flex gap-3"><span>🚌</span><div><div className="font-semibold">By Taxi</div><div className="text-gray-500">Take any taxi to Rossburgh from Warwick Junction.</div></div></li>
          <li className="flex gap-3"><span>🚶</span><div><div className="font-semibold">On Foot</div><div className="text-gray-500">10 minute walk from Rossburgh train station.</div></div></li>
        </ul>
      </div>
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="font-bold text-[#1E3A8A] text-lg mb-4">Parking Tips</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2"><span>✅</span><span>Limited parking on site. Arrive early.</span></li>
          <li className="flex gap-2"><span>✅</span><span>Street parking on Combine Rd.</span></li>
          <li className="flex gap-2"><span>⚠️</span><span>Do not block driveways. Fines are issued.</span></li>
          <li className="flex gap-2"><span>⚠️</span><span>Keep valuables out of sight in your car.</span></li>
        </ul>
      </div>
      <div className="bg-[#1E3A8A] text-white rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-4">Contact Information</h2>
        <div className="space-y-2 text-sm">
          <div><span className="text-blue-300 font-bold">Phone: </span>031 000 0000</div>
          <div><span className="text-blue-300 font-bold">Email: </span>rossburgh@dltc.gov.za</div>
          <div><span className="text-blue-300 font-bold">Region: </span>eThekwini Municipality</div>
        </div>
      </div>
    </main>
  )
}