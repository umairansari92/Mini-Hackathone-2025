import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // ✅ Set displayName in Firebase Auth
      await updateProfile(userCredential.user, { displayName: name });

      // ✅ Save user record in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
      });

      alert("Signup successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="text-center mt-12">
      <h2 className="text-2xl font-bold mb-4 text-indigo-400">Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white"
        /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white"
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white"
        /><br />
        <button type="submit" className="bg-indigo-600 px-4 py-2 rounded">Signup</button>
      </form>
    </div>
  );
}
export default Signup;
