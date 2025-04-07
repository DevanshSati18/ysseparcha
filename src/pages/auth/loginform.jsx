import { auth, db } from "../../firebase/firebaseConfig";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userRef = doc(db, "users", email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData.role;

        // Redirect based on role
        switch (role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "doctor":
            navigate("/doctor-dashboard");
            break;
          case "chemist":
            navigate("/chemist-dashboard");
            break;
          case "usher":
            navigate("/usher-dashboard");
            break;
          default:
            navigate("/user-dashboard"); // Default dashboard
            break;
        }
      } else {
        setError("User role not found.");
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-3 border border-orange-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-3 border border-orange-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        required
      />
      <button type="submit" className="bg-orange-600 text-white p-3 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
