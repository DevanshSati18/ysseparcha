import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import LoginPage from "./pages/auth/login_page";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ChemistDashboard from "./pages/chemist/ChemistDashboard";
import UsherDashboard from "./pages/usher/UsherDashboard";

// ProtectedRoute component to guard routes based on user roles
const ProtectedRoute = ({ userRole, requiredRole, children }) => {
  if (!userRole) {
    return <Navigate to="/" replace />; // Redirect to login if not logged in
  }
  if (userRole !== requiredRole) {
    return <Navigate to="/" replace />; // Redirect to login if the role doesn't match
  }
  return children; // If user is logged in and has the correct role, render the route
};

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
        {/* Login Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute userRole={userRole} requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute userRole={userRole} requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chemist-dashboard"
          element={
            <ProtectedRoute userRole={userRole} requiredRole="chemist">
              <ChemistDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usher-dashboard"
          element={
            <ProtectedRoute userRole={userRole} requiredRole="usher">
              <UsherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route to redirect to the login page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
