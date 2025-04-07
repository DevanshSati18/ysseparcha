import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use `useNavigate` from React Router v6
import { signOut, onAuthStateChanged } from "firebase/auth"; // Firebase signOut and auth state change listener
import { auth } from "../../firebase/firebaseConfig"; // Firebase authentication
import UserManagement from "./UserManagement.jsx";
import AddUsers from "./AddUsers.jsx";
import PatientsOverview from "./PatientsOverview.jsx";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("users");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const navigate = useNavigate(); // Use `useNavigate` to navigate in React Router v6
  const [sidebarOpen, setSidebarOpen] = useState(false); // Track whether sidebar is open on mobile

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login if the user is not authenticated
        navigate("/login");
      } else {
        // Set user as authenticated if logged in
        setIsAuthenticated(true);
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [navigate]);

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Logout the user
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    }).catch((error) => {
      console.error("Error during sign out:", error);
    });
  };

  // If the user is not authenticated, do not render the dashboard
  if (!isAuthenticated) {
    return null; // Or a loading spinner can be shown here
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-blue-800 text-white p-4 transition-all duration-300 ease-in-out sm:w-64 md:w-1/5 h-full flex flex-col justify-between`}
      >
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Dashboard</h2>
          <ul>
            <li
              onClick={() => setSelectedTab("users")}
              className="cursor-pointer py-2 px-4 hover:bg-blue-700 rounded mb-2"
            >
              Users
            </li>
            <li
              onClick={() => setSelectedTab("add-user")}
              className="cursor-pointer py-2 px-4 hover:bg-blue-700 rounded mb-2"
            >
              Add User
            </li>
            <li
              onClick={() => setSelectedTab("patients")}
              className="cursor-pointer py-2 px-4 hover:bg-blue-700 rounded mb-2"
            >
              Patients
            </li>
          </ul>
        </div>
        <div className="mt-6">
          <button
            onClick={handleLogout} // Using signOut from Firebase modular SDK
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-blue-700 text-white p-4 flex items-center justify-between fixed top-0 left-0 w-full z-20 shadow-md">
          <h1 className="text-2xl">Admin Dashboard</h1>
          <button
            onClick={toggleSidebar}
            className="sm:hidden text-white bg-blue-600 p-2 rounded-md"
          >
            <i className="fa fa-bars"></i>
          </button>
        </div>

        <div className="flex-1 p-6 mt-16 overflow-auto">
          <div className="p-4 bg-white shadow-lg rounded-lg">
            {selectedTab === "users" && <UserManagement />}
            {selectedTab === "add-user" && <AddUsers />}
            {selectedTab === "patients" && <PatientsOverview />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
