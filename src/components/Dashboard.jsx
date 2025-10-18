// src/components/Dashboard.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Dashboard() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


  const handleGenerate = async () => {
    if (!idea.trim()) return alert("Please enter your startup idea first!");
    setLoading(true);

    try {
      const prompt = `
      You are an AI startup assistant. Based on this idea: "${idea}",
      generate the following in short form JSON:
      {
        "name": "Startup name",
        "tagline": "Tagline",
        "pitch": "2–3 line pitch",
        "audience": "Target audience"
      }`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const data = JSON.parse(text.replace(/```json|```/g, "").trim());

      setGenerated(data);

      // Save to Firestore
      await addDoc(collection(db, "pitches"), {
        uid: auth.currentUser.uid,
        idea,
        ...data,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
      alert("Error generating pitch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700 bg-gray-900 bg-opacity-70 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-indigo-400">PitchCraft Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          Logout
        </button>
      </header>

      <main className="max-w-3xl mx-auto mt-12 px-6">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Generate Your <span className="text-indigo-400">AI Startup Pitch</span>
        </h2>

        <div className="bg-gray-900 bg-opacity-70 border border-gray-700 rounded-2xl shadow-xl p-8 space-y-6 backdrop-blur-sm">
          <textarea
            className="w-full h-32 px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Write your startup idea here..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          ></textarea>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/40"
            }`}
          >
            {loading ? "Generating..." : "Generate Pitch"}
          </button>

          {generated && (
            <div className="mt-8 space-y-4 animate-fadeIn">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-1">Startup Name</h3>
                <p>{generated.name}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-1">Tagline</h3>
                <p>{generated.tagline}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-1">Pitch</h3>
                <p>{generated.pitch}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-1">Target Audience</h3>
                <p>{generated.audience}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-gray-500 mt-16 pb-6 text-sm">
        © 2025 PitchCraft | AI Startup Partner
      </footer>
    </div>
  );
}

export default Dashboard;
