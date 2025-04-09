import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import UserManagement from "./UserManagement.jsx";
import AddUsers from "./AddUsers.jsx";
import PatientsOverview from "./PatientsOverview.jsx";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("users");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
      });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-orange-400 text-white p-4 transition-all duration-300 ease-in-out sm:w-64 md:w-1/5 h-full flex flex-col justify-between absolute sm:relative z-30 ${
          sidebarOpen ? "left-0" : "-left-64"
        } sm:left-0`}
      >
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Dashboard</h2>
          <ul>
            <li
              onClick={() => setSelectedTab("users")}
              className="cursor-pointer py-2 px-4 hover:bg-orange-400 rounded mb-2"
            >
              Users
            </li>
            <li
              onClick={() => setSelectedTab("add-user")}
              className="cursor-pointer py-2 px-4 hover:bg-orange-400 rounded mb-2"
            >
              Add User
            </li>
            <li
              onClick={() => setSelectedTab("patients")}
              className="cursor-pointer py-2 px-4 hover:bg-orange-400 rounded mb-2"
            >
              Patients
            </li>
          </ul>
        </div>
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-orange-400 text-white p-4 flex items-center justify-between fixed top-0 left-0 w-full z-20 shadow-md">
          <h1 className="text-2xl">Admin Dashboard</h1>

          {/* Hamburger Button (Drawer toggle) */}
          <button
            onClick={toggleSidebar}
            className="sm:hidden text-white bg-orange-400 p-2 rounded-md"
          >
            <i className="fa fa-bars"></i> {/* Hamburger icon */}
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
