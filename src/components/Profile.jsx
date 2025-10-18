import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [pitches, setPitches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }

      // ✅ User document from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) setUserData(userSnap.data());

      // ✅ Fetch user’s pitches
      const q = query(collection(db, "pitches"), where("uid", "==", user.uid));
      const querySnap = await getDocs(q);
      const list = querySnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPitches(list);
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
      >
        Dashboard
      </button>
      <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6">Profile</h1>

        {userData ? (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {userData.name}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {userData.createdAt?.toDate().toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}

        <h2 className="text-2xl font-semibold text-indigo-300 mt-8 mb-4">
          Your Pitches
        </h2>
        {pitches.length > 0 ? (
          pitches.map((pitch) => (
            <div
              key={pitch.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3"
            >
              <h3 className="text-lg text-indigo-400 font-semibold">
                {pitch.pitchData.startupName}
              </h3>
              <p className="text-gray-300">{pitch.pitchData.tagline}</p>
            </div>
          ))
        ) : (
          <p>No pitches found.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
