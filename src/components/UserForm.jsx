import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const UserForm = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("doctor");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "users"), { email, role });
    setEmail("");
    setRole("doctor");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Add User</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="border p-2 w-full"
          required 
        />
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          className="border p-2 w-full mt-2"
        >
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="chemist">Chemist</option>
          <option value="usher">Usher</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
          Add User
        </button>
      </form>
    </div>
  );
};

export default UserForm;
