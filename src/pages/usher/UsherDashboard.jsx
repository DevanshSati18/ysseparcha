import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
  startAfter,
} from "firebase/firestore";

const UsherDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [error, setError] = useState(null);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientAdded, setNewPatientAdded] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientsRef = collection(db, "patients");
      const firstQuery = query(patientsRef, orderBy("name"), limit(15));
      const querySnapshot = await getDocs(firstQuery);
      const patientsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientsList);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      setError("Failed to fetch patients.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMorePatients = async () => {
    if (!lastVisible) return;
    setLoading(true);
    setError(null);
    try {
      const patientsRef = collection(db, "patients");
      const nextQuery = query(
        patientsRef,
        orderBy("name"),
        startAfter(lastVisible),
        limit(15)
      );
      const querySnapshot = await getDocs(nextQuery);
      const morePatients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients((prev) => [...prev, ...morePatients]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      setError("Failed to load more patients.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async () => {
    if (!newPatientName) {
      setError("Patient name is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, "patients"), {
        name: newPatientName,
        timestamp: new Date(),
      });
      setNewPatientAdded(true);
      setNewPatientName("");
      fetchPatients();
    } catch (err) {
      setError("Failed to add new patient.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">
        Usher Dashboard
      </h1>

      {/* Add New Patient */}
      <div className="flex justify-center items-center mb-6 space-x-4">
        <input
          type="text"
          value={newPatientName}
          onChange={(e) => setNewPatientName(e.target.value)}
          className="border px-4 py-3 rounded-lg shadow-md w-64 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Enter New Patient Name"
        />
        <button
          onClick={handleAddPatient}
          className="bg-orange-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-500 transition duration-200"
        >
          Add Patient
        </button>
      </div>

      {newPatientAdded && (
        <p className="text-center text-green-500 mb-4">
          Patient added successfully!
        </p>
      )}
      {loading && <p className="text-center text-blue-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display Patients List */}
      <div>
        {patients.length > 0 ? (
          <div className="space-y-4">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold">{patient.name}</h3>
                <p className="text-gray-500">
                  Phone: {patient.phoneNo || "Not Available"}
                </p>
                <p className="text-gray-500">
                  Age: {patient.age || "Not Available"}
                </p>
                <p className="text-gray-500">
                  Address: {patient.address || "Not Available"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No patients found.</p>
        )}
      </div>

      {/* Load More Button */}
      {!loading && patients.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={fetchMorePatients}
            className="bg-orange-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-500 transition duration-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default UsherDashboard;
