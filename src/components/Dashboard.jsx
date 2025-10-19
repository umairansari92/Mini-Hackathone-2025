import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { generatePitch } from "../services/GeminiService";

// Add this helper function at the top of your file
const safeEncode = (obj) => {
  return encodeURIComponent(JSON.stringify(obj));
};

function Dashboard() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleGenerate = async () => {
    if (!idea.trim()) return alert("Please enter your startup idea first!");
    setLoading(true);
    setGenerated(null);

    try {
      const data = await generatePitch(idea);
      setGenerated(data);

      // ✅ Save as a single structured object
      const pitchObject = {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Anonymous User",
        idea,
        pitchData: data, // store whole JSON object under "pitchData"
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "pitches"), pitchObject);
      alert("Pitch saved successfully!");
    } catch (error) {
      console.error("Error saving pitch:", error);
      alert("Error generating or saving pitch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700 bg-gray-900 bg-opacity-70 backdrop-blur-sm">
        <button
          onClick={() => navigate("/profile")}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          Profile
        </button>

        <h1 className="text-2xl font-bold text-indigo-400">
          PitchCraft Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          Logout
        </button>
      </header>

      <main className="max-w-3xl mx-auto mt-12 px-6">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Generate Your{" "}
          <span className="text-indigo-400">AI Startup Pitch</span>
        </h2>

        <h2 className="text-lg text-gray-300 text-center mt-2">
          Welcome,{" "}
          <span className="text-indigo-400 font-semibold">
            {auth.currentUser?.displayName || "User"}
          </span>{" "}
          👋
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
                <h3 className="text-lg font-semibold text-indigo-400 mb-1">
                  Startup Name
                </h3>
                <p>{generated.startupName}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-1">
                  Tagline
                </h3>
                <p>{generated.tagline}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-1">
                  Pitch
                </h3>
                <p>{generated.elevatorPitch}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-1">
                  Target Audience
                </h3>
                <p>{generated.targetAudience}</p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                  Problems
                </h3>
                <div className="space-y-2">
                  {generated.problems?.map((problem, index) => (
                    <div key={index} className="p-3 bg-gray-900 rounded-lg">
                      <h4 className="font-medium text-indigo-300">
                        {problem.title}
                      </h4>
                      <p className="text-gray-300 text-sm mt-1">
                        {problem.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                  Solutions
                </h3>
                <div className="space-y-2">
                  {generated.solutions?.map((solution, index) => (
                    <div key={index} className="p-3 bg-gray-900 rounded-lg">
                      <h4 className="font-medium text-indigo-300">
                        {solution.title}
                      </h4>
                      <p className="text-gray-300 text-sm mt-1">
                        {solution.description}
                      </p>
                      <div className="mt-2">
                        <p className="text-xs text-indigo-400 mb-1">Benefits:</p>
                        <ul className="list-disc list-inside text-sm text-gray-300">
                          {solution.benefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {generated && (
                <button
                  onClick={() => {
                    const encodedData = encodeURIComponent(JSON.stringify(generated));
                    navigate(`/preview/${encodedData}`);
                  }}
                  className="w-full py-3 mt-6 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold shadow-lg hover:brightness-105 transition"
                >
                  Preview Landing Page
                </button>
              )}
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
