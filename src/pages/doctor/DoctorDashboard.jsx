import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig'; // Adjust the path as necessary
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const DoctorDashboard = () => {
  const [couponNumber, setCouponNumber] = useState('');  // To hold the input value
  const [patientDetails, setPatientDetails] = useState(null);  // To hold fetched patient data
  const [loading, setLoading] = useState(false);  // To show loading indicator
  const [error, setError] = useState(null);  // To handle errors
  const [remarks, setRemarks] = useState({});  // To store remarks for each department
  const [prescriptions, setPrescriptions] = useState({});  // To store prescriptions for each department

  // Fetch patient details by coupon number (patient ID)
  const fetchPatientDetails = async (couponNumber) => {
    setLoading(true);
    setError(null);  // Reset any previous errors
    try {
      const patientRef = doc(db, 'patients', couponNumber); // Use couponNumber as the doc ID
      const patientSnap = await getDoc(patientRef);

      if (patientSnap.exists()) {
        setPatientDetails(patientSnap.data());
      } else {
        setPatientDetails(null);
        setError('User not found.');
      }
    } catch (err) {
      setError('Failed to fetch patient details.');
    } finally {
      setLoading(false);
    }
  };

  // Handle saving remarks and prescriptions to the database
  const handleSave = async () => {
    if (!patientDetails) {
      setError('No patient data found.');
      return;
    }
    try {
      const patientRef = doc(db, 'patients', couponNumber);
      await updateDoc(patientRef, {
        prescriptions: prescriptions,
        remarks: remarks
      });
      setError('Data saved successfully!');
    } catch (err) {
      setError('Failed to save data.');
    }
  };

  // Handle input changes for remarks and prescriptions
  const handleInputChange = (dept, type, value) => {
    if (type === 'remark') {
      setRemarks({
        ...remarks,
        [dept]: value
      });
    } else if (type === 'prescription') {
      setPrescriptions({
        ...prescriptions,
        [dept]: value
      });
    }
  };

  const handleSearch = () => {
    if (couponNumber) {
      fetchPatientDetails(couponNumber);
    } else {
      setError('Please enter a coupon number.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">Doctor Dashboard</h1>

      {/* Coupon Number Input */}
      <div className="flex justify-center items-center mb-6 space-x-4">
        <input
          type="text"
          value={couponNumber}
          onChange={(e) => setCouponNumber(e.target.value)}
          className="border px-4 py-3 rounded-lg shadow-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Coupon Number"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Search Patient
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-blue-600">Loading...</p>}

      {/* Error Message */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display Patient Details if Available */}
      {patientDetails && !loading && !error && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Patient Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Patient Name:</span>
                <span className="text-gray-600">{patientDetails.name || 'Not Available'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Age:</span>
                <span className="text-gray-600">{patientDetails.age || 'Not Available'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Phone Number:</span>
                <span className="text-gray-600">{patientDetails.mobile || 'Not Available'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Address:</span>
                <span className="text-gray-600">{patientDetails.address || 'Not Available'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Treatments:</span>
                <span className="text-gray-600">{patientDetails.treatments?.join(', ') || 'Not Available'}</span>
              </div>
            </div>
          </div>

          {/* Prescriptions and Remarks Section */}
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Prescriptions and Remarks</h2>
            <div className="space-y-4">
              {patientDetails.treatments?.map((dept) => (
                <div key={dept} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-700">{dept}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Prescription:</span>
                      <textarea
                        value={prescriptions[dept] || ''}
                        onChange={(e) => handleInputChange(dept, 'prescription', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Enter Prescription"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Remarks:</span>
                      <textarea
                        value={remarks[dept] || ''}
                        onChange={(e) => handleInputChange(dept, 'remark', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Enter Remarks"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
              >
                Save Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
