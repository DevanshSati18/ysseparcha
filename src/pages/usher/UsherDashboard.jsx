import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig'; // Adjust the path as necessary
import { collection, getDocs, query, orderBy, limit, addDoc, startAfter } from 'firebase/firestore';

const UsherDashboard = () => {
  const [patients, setPatients] = useState([]);  // To hold the list of patients
  const [loading, setLoading] = useState(false);  // To show loading indicator
  const [lastVisible, setLastVisible] = useState(null);  // To store the last fetched patient for pagination
  const [error, setError] = useState(null);  // To handle errors
  const [newPatientName, setNewPatientName] = useState('');  // New patient's name input
  const [newPatientAdded, setNewPatientAdded] = useState(false);  // To show success message after adding a patient

  // Fetch the initial patients
  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientsRef = collection(db, 'patients'); // Using the 'patients' collection
      const firstQuery = query(patientsRef, orderBy('name'), limit(15));  // Fetch first 15 patients

      const querySnapshot = await getDocs(firstQuery);
      const patientsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setPatients(patientsList);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);  // Set the last document for pagination
    } catch (err) {
      setError('Failed to fetch patients.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch more patients when the "Load More" button is clicked
  const fetchMorePatients = async () => {
    if (!lastVisible) return;  // If there's no last visible document, return

    setLoading(true);
    setError(null);
    try {
      const patientsRef = collection(db, 'patients'); // Using the 'patients' collection
      const nextQuery = query(
        patientsRef,
        orderBy('name'),
        startAfter(lastVisible),
        limit(15)  // Fetch next 15 patients
      );

      const querySnapshot = await getDocs(nextQuery);
      const morePatients = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setPatients(prevPatients => [...prevPatients, ...morePatients]);  // Append new patients to the list
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);  // Update last visible document for pagination
    } catch (err) {
      setError('Failed to load more patients.');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new patient
  const handleAddPatient = async () => {
    if (!newPatientName) {
      setError('Patient name is required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, 'patients'), {
        name: newPatientName,
        timestamp: new Date()
      });

      setNewPatientAdded(true);  // Show success message
      setNewPatientName('');  // Reset the input field
      fetchPatients();  // Refetch patients to update the list
    } catch (err) {
      setError('Failed to add new patient.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();  // Fetch patients when the component mounts
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">Usher Dashboard</h1>

      {/* Add New Patient */}
      <div className="flex justify-center items-center mb-6 space-x-4">
        <input
          type="text"
          value={newPatientName}
          onChange={(e) => setNewPatientName(e.target.value)}
          className="border px-4 py-3 rounded-lg shadow-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter New Patient Name"
        />
        <button
          onClick={handleAddPatient}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
        >
          Add Patient
        </button>
      </div>

      {/* Success Message */}
      {newPatientAdded && <p className="text-center text-green-500 mb-4">Patient added successfully!</p>}

      {/* Loading Indicator */}
      {loading && <p className="text-center text-blue-600">Loading...</p>}

      {/* Error Message */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display Patients List */}
      <div>
        {patients.length > 0 ? (
          <div className="space-y-4">
            {patients.map(patient => (
              <div key={patient.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">{patient.name}</h3>
                {/* Add more patient details here */}
                <p className="text-gray-500">Phone: {patient.phoneNo || 'Not Available'}</p>
                <p className="text-gray-500">Age: {patient.age || 'Not Available'}</p>
                <p className="text-gray-500">Address: {patient.address || 'Not Available'}</p>
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
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default UsherDashboard;
