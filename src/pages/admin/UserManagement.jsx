import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig"; // Firebase Firestore
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"; // Firestore operations
import { toast } from "react-toastify"; // For showing success/error messages

const UserManagement = () => {
  const [email, setEmail] = useState(""); // For searching user by email
  const [userData, setUserData] = useState(null); // Store user data fetched from Firestore
  const [newUserData, setNewUserData] = useState({ name: "", age: "", address: "", dept: "", mobileNo: "", role: "" }); // Data for editing user
  const [loading, setLoading] = useState(false); // To manage loading state

  // Fetch user data based on email (document ID)
  const fetchUserData = async () => {
    if (email) {
      setLoading(true);
      try {
        const userRef = doc(db, "users", email); // Firestore document ID is email
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setNewUserData({
            name: docSnap.data().name,
            age: docSnap.data().age,
            address: docSnap.data().address,
            dept: docSnap.data().dept,
            mobileNo: docSnap.data().mobileNo,
            role: docSnap.data().role, // Setting initial role value from Firestore
          }); // Initialize editing data with current user data
        } else {
          toast.error("User not found!");
          setUserData(null);
        }
      } catch (error) {
        toast.error("Error fetching user data: " + error.message);
      }
      setLoading(false);
    }
  };

  // Handle the editing of user data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update user data (excluding email and createdAt)
  const handleUpdateUser = async () => {
    if (email) {
      setLoading(true);
      try {
        const userRef = doc(db, "users", email);

        // Only update the fields that are editable (excluding email and createdAt)
        const { email, createdAt, ...updateData } = newUserData;

        await updateDoc(userRef, updateData);
        toast.success("User details updated successfully!");
      } catch (error) {
        toast.error("Error updating user data: " + error.message);
      }
      setLoading(false);
    }
  };

  // Delete user document
  const handleDeleteUser = async () => {
    if (email) {
      setLoading(true);
      try {
        const userRef = doc(db, "users", email);
        await deleteDoc(userRef);
        toast.success("User deleted successfully!");
        setUserData(null);
        setNewUserData({ name: "", age: "", address: "", dept: "", mobileNo: "", role: "" });
      } catch (error) {
        toast.error("Error deleting user: " + error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={fetchUserData}
          className="ml-2 p-2 bg-orange-400 hover:bg-orange-600 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* User Data Form for Editing */}
      {userData ? (
        <div>
          <div className="mb-4">
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={newUserData.name}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Age:</label>
            <input
              type="text"
              name="age"
              value={newUserData.age}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Address:</label>
            <textarea
              name="address"
              value={newUserData.address}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Department:</label>
            <input
              type="text"
              name="dept"
              value={newUserData.dept}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Mobile Number:</label>
            <input
              type="text"
              name="mobileNo"
              value={newUserData.mobileNo}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Role:</label>
            <select
              name="role"
              value={newUserData.role}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="admin">Admin</option>
              <option value="usher">Usher</option>
              <option value="chemist">Chemist</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleUpdateUser}
              className="p-2 bg-green-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update User"}
            </button>

            <button
              onClick={handleDeleteUser}
              className="p-2 bg-red-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete User"}
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-500">
          No user data found. Please search by email.
        </p>
      )}
    </div>
  );
};

export default UserManagement;
