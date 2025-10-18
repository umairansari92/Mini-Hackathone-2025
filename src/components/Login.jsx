import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <div className="bg-gray-900 bg-opacity-80 border border-gray-700 rounded-2xl shadow-2xl p-8 w-96 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
          Login to <span className="text-indigo-400">PitchCraft</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
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
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          New here?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
          >
            Create Account
          </Link>
        </p>

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2025 PitchCraft. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Login;
