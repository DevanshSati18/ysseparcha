import React, { useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/Sidebar";
import UserList from "../../components/UserList.jsx";
import PatientList from "../../components/PatientList.jsx";
import UserForm from "../../components/UserForm.jsx";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("users");

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar setSelectedTab={setSelectedTab} />

        {/* Main Content */}
        <div className="flex-1 p-5">
          <Navbar title="Admin Dashboard" />

          <div className="p-4 bg-white shadow-lg rounded-lg">
            {selectedTab === "users" && <UserList />}
            {selectedTab === "add-user" && <UserForm />}
            {selectedTab === "patients" && <PatientList />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
