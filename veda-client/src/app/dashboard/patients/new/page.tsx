"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function NewPatientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", age: "", gender: "Male", mobile: "", address: "" });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/patients`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Patient Created!");
      router.push("/dashboard"); // Go back to dashboard
    } catch (err) {
      alert("Error creating patient");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-6 text-sm hover:text-black">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-bold mb-6">Register New Patient</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
          <input required type="text" className="w-full p-3 border rounded-lg" onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Age</label>
            <input required type="number" className="w-full p-3 border rounded-lg" onChange={(e) => setFormData({...formData, age: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gender</label>
            <select className="w-full p-3 border rounded-lg bg-white" onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
          <input required type="tel" className="w-full p-3 border rounded-lg" onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-primary-600 text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary-700">
          <Save size={18} /> Save Patient Record
        </button>
      </form>
    </div>
  );
}