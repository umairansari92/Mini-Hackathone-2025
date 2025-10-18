import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: new Date(),
      });
      alert("Signup successful!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <div className="bg-gray-900 bg-opacity-80 border border-gray-700 rounded-2xl shadow-2xl p-8 w-96 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
          Create Your <span className="text-indigo-400">PitchCraft</span> Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 font-semibold text-white shadow-md hover:shadow-indigo-500/40"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
          >
            Login
          </Link>
        </p>

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2025 PitchCraft. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Signup;
