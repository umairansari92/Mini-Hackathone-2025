// src/App.jsx
import { Routes, Route, useParams } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPreview from "./components/LandingPreview";

// Safe decoder helper
const safeDecode = (str) => {
  try {
    return JSON.parse(decodeURIComponent(str));
  } catch (e) {
    console.error("Failed to decode pitch data:", e);
    return null;
  }
};

// Preview wrapper component
const PreviewWrapper = () => {
  const { data } = useParams();
  return <LandingPreview pitch={safeDecode(data)} />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/preview/:data" element={<PreviewWrapper />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
