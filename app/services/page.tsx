export default function ServicesPage() {

  const services = [
    {
      icon: '🚗',
      title: "Driver's Licence Renewal",
      description: 'Renew your existing driver licence before or after expiry.',
      steps: [
        'Complete the DL1 renewal form',
        'Submit original ID and certified copy',
        'Undergo eye test if required',
        'Pay the renewal fee',
        'Collect temporary licence',
      ],
      fee: 'R 260.00',
      time: '2 - 3 hours',
    },
    {
      icon: '🪪',
      title: 'PrDP Application',
      description: 'Apply for a Professional Driving Permit to drive passengers or goods.',
      steps: [
        'Complete the PrDP application form',
        'Submit ID, licence and medical certificate',
        'Provide passport photos',
        'Pay the application fee',
        'Wait for card to be processed',
      ],
      fee: 'R 380.00',
      time: '3 - 4 hours',
    },
    {
      icon: '📝',
      title: "Driver's Licence Test",
      description: 'Book and complete your driver licence test after passing your learner.',
      steps: [
        'Bring valid learner licence',
        'Complete application form',
        'Pay the test fee',
        'Complete the yard and road test',
        'Receive results on the day',
      ],
      fee: 'R 380.00',
      time: '4 - 5 hours',
    },
    {
      icon: '📖',
      title: "Learner's Licence Test",
      description: 'Book your learner licence test to get started on the road.',
      steps: [
        'Complete the LL1 application form',
        'Submit ID and certified copy',
        'Pay the test booking fee',
        'Study the K53 handbook',
        'Complete the written test',
      ],
      fee: 'R 135.00',
      time: '2 - 3 hours',
    },
    {
      icon: '🔄',
      title: 'Licence Card Collection',
      description: 'Collect your processed driver licence card from the centre.',
      steps: [
        'Bring your original ID',
        'Bring your collection receipt',
        'Bring your temporary licence if issued',
        'Visit the collection counter',
        'Sign for your new card',
      ],
      fee: 'Free',
      time: '30 - 60 min',
    },
    {
      icon: '💳',
      title: 'Licence Card Replacement',
      description: 'Replace a lost, stolen or damaged driver licence card.',
      steps: [
        'Complete the replacement form',
        'Submit affidavit for lost or stolen card',
        'Submit ID and certified copy',
        'Pay the replacement fee',
        'Collect temporary licence',
      ],
      fee: 'R 260.00',
      time: '2 - 3 hours',
    },
  ]

  const fees = [
    { service: "Learner's Licence Test", fee: 'R 135.00' },
    { service: "Driver's Licence Test", fee: 'R 380.00' },
    { service: "Driver's Licence Renewal", fee: 'R 260.00' },
    { service: 'PrDP Application', fee: 'R 380.00' },
    { service: 'Licence Card Replacement', fee: 'R 260.00' },
    { service: 'Licence Card Collection', fee: 'Free' },
  ]

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">

      <div className="text-center mb-12">
        <span className="inline-block bg-[#0EA5E9] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          All Services
        </span>
        <h1 className="text-3xl font-bold text-[#1E3A8A]">
          Services at Rossburgh DLTC
        </h1>
        <p className="text-gray-500 mt-2">
          Find out what services are available, what they cost and how long they take.
        </p>
      </div>

      <div
        className="grid gap-6 mb-16"
        style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
      >
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-white rounded-2xl shadow p-6 border border-gray-100"
          >
            <div className="text-4xl mb-3">{service.icon}</div>
            <h2 className="text-lg font-bold text-[#1E3A8A] mb-1">
              {service.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {service.description}
            </p>

            <div className="flex gap-4 mb-4">
              <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full">
                Fee: {service.fee}
              </span>
              <span className="text-xs bg-purple-50 text-purple-700 font-bold px-3 py-1 rounded-full">
                Time: {service.time}
              </span>
            </div>

            <h3 className="text-sm font-bold text-gray-700 mb-2">
              Steps:
            </h3>
            <ol className="space-y-1">
              {service.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-[#0EA5E9] font-bold">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 text-center">
          Fee Summary
        </h2>
        <div className="space-y-3">
          {fees.map((item) => (
            <div
              key={item.service}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <span className="text-gray-700 font-medium">{item.service}</span>
              <span className={`font-bold text-lg ${item.fee === 'Free' ? 'text-green-600' : 'text-[#1E3A8A]'}`}>
                {item.fee}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          Fees are approximate and subject to change. Confirm at the centre before payment.
        </p>
      </div>

    </main>
  )
}