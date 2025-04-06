import React from "react";

const Sidebar = ({ setSelectedTab }) => {
  return (
    <div className="w-64 h-full bg-blue-600 text-white p-5">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <ul>
        <li className="cursor-pointer py-2 hover:bg-orange-700 px-2" onClick={() => setSelectedTab("users")}>
          Manage Users
        </li>
        <li className="cursor-pointer py-2 hover:bg-orange-700 px-2" onClick={() => setSelectedTab("add-user")}>
          Add User
        </li>
        <li className="cursor-pointer py-2 hover:bg-orange-700 px-2" onClick={() => setSelectedTab("patients")}>
          View Patients
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
