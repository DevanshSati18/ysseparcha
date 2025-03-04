import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import LoginPage from "./pages/auth/login_page";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ChemistDashboard from "./pages/chemist/ChemistDashboard";
import UsherDashboard from "./pages/usher/UsherDashboard";


const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.email);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        }
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {userRole === "admin" && <Route path="/admin-dashboard" element={<AdminDashboard />} />}
        {userRole === "doctor" && <Route path="/doctor-dashboard" element={<DoctorDashboard />} />}
        {userRole === "chemist" && <Route path="/chemist-dashboard" element={<ChemistDashboard />} />}
        {userRole === "usher" && <Route path="/usher-dashboard" element={<UsherDashboard />} />}
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
