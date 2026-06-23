"use client";

import { useState } from "react";

export default function BookingsPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    alert("Booking submitted successfully!");

    setFormData({
      fullName: "",
      idNumber: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      time: "",
      notes: "",
    });
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">
        Book an Appointment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 space-y-4"
      >
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          value={formData.idNumber}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Service</option>
          <option value="Licence Renewal">
            Driver's Licence Renewal
          </option>
          <option value="PrDP">
            PrDP Application/Renewal
          </option>
          <option value="Driver Test">
            Driver's Licence Test
          </option>
          <option value="Card Collection">
            Licence Card Collection
          </option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          rows={4}
        />

        <button
          type="submit"
          className="bg-blue-900 text-white px-6 py-3 rounded-lg"
        >
          Submit Booking
        </button>
      </form>
    </main>
  );
}