// src/components/Dashboard.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { generatePitch } from "../services/GemiServices";

function Dashboard() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Generate pitch with Gemini
  const handleGenerate = async () => {
    if (!idea.trim()) return alert("Please enter your startup idea first!");
    setLoading(true);
    setGenerated(null);

    try {
      const data = await generatePitch(idea);
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
      alert("Error generating pitch. Please try again later.");
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
                <p>{generated.startupName}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-1">Tagline</h3>
                <p>{generated.tagline}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-1">Elevator Pitch</h3>
                <p>{generated.elevatorPitch}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-1">Target Audience</h3>
                <p>{generated.targetAudience}</p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Hero Copy</h3>
                <p>{generated.heroCopy}</p>
              </div>

              {/* Color Palette */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Color Palette</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {generated.colorPalette?.map((color, index) => (
                    <div
                      key={index}
                      className="rounded-lg p-3 border border-gray-600 text-sm"
                      style={{ backgroundColor: color.hex }}
                    >
                      <p className="font-semibold">{color.name}</p>
                      <p className="text-xs">{color.hex}</p>
                      <p className="text-xs italic">{color.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logo Concepts */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Logo Concepts</h3>
                {generated.logoConcepts?.map((logo, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-semibold">{logo.idea}</p>
                    <p className="text-sm text-gray-300">{logo.visualDescription}</p>
                  </div>
                ))}
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
