import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import imagegif from './assets/ysslogo.png';
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
    // Set a timeout to stop the loading state after 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 2 seconds timeout

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.email);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        }
      }
      setLoading(false); // Stop loading once data is fetched or onAuthStateChanged is done
    });

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col ">
        {/* Increased size of image */}
        <img
          src={imagegif} // Replace this with your loader image
          alt="Loading..."
          className="w-32 h-32 mb-4" // Increased image size and added margin-bottom
        />
        
        {/* Loader */}
        <div className="w-16 h-16 border-8 border-white border-t-orange-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

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
