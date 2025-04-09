import React, { useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig"; // Firebase authentication and Firestore
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase authentication to create user
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions to store and get data

const AddUsers = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "usher", // Default value "usher", can be changed in the form
    dept: "",
    mobileNo: "",
    age: "",
    address: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [isSubmitting, setIsSubmitting] = useState(false); // To disable form during submission

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the page reload
    setError(""); // Clear any previous errors
    setSuccessMessage(""); // Clear previous success messages

    // Check if all fields are filled
    if (
      !userData.name ||
      !userData.email ||
      !userData.role ||
      !userData.mobileNo ||
      !userData.age ||
      !userData.address ||
      !userData.password
    ) {
      setError("All fields are required.");
      return;
    }

    // Check if email already exists
    const userRef = doc(db, "users", userData.email);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      setError("User with this email already exists.");
      return;
    }

    setIsSubmitting(true); // Disable the form while submitting

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const user = userCredential.user;

      // Create user data for Firestore (additional fields like name, role, dept, etc.)
      const userDetails = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        mobileNo: userData.mobileNo,
        age: userData.age,
        address: userData.address,
        dept: userData.role === "doctor" || userData.role === "usher" ? userData.dept : "", // Only set dept for "doctor" and "usher"
        createdAt: new Date(),
      };

      // Add the user data to Firestore
      await setDoc(userRef, userDetails);

      // Set success message
      setSuccessMessage("User created successfully!");

      // Reset the form fields after 2 seconds
      setTimeout(() => {
        setUserData({
          name: "",
          email: "",
          role: "usher",
          dept: "",
          mobileNo: "",
          age: "",
          address: "",
          password: "",
        });
        setSuccessMessage(""); // Clear success message after form reset
      }, 2000); // Wait 2 seconds before resetting the form

    } catch (error) {
      setError("Error creating user: " + error.message);
    } finally {
      setIsSubmitting(false); // Re-enable the form after submission
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">Add New User</h2>

      {/* Show success message after successful user creation */}
      {successMessage && (
        <div className="bg-green-500 text-white text-center p-4 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Show error if any */}
      {error && <div className="bg-red-500 text-white text-center p-4 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter full name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter email"
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="usher">Usher</option>
            <option value="admin">Admin</option>
            <option value="chemist">Chemist</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        {/* Department (only visible for Doctor and Usher) */}
        {(userData.role === "doctor" || userData.role === "usher") && (
          <div className="mb-4">
            <label className="block text-gray-700">Department</label>
            <input
              type="text"
              name="dept"
              value={userData.dept}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter department"
            />
          </div>
        )}

        {/* Mobile No */}
        <div className="mb-4">
          <label className="block text-gray-700">Mobile Number</label>
          <input
            type="text"
            name="mobileNo"
            value={userData.mobileNo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter mobile number"
          />
        </div>

        {/* Age */}
        <div className="mb-4">
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={userData.age}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter age"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter address"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter password"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={`w-full p-2 bg-blue-500 text-white rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? "Creating User..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default AddUsers;
