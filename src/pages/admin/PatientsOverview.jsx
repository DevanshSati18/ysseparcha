import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig"; // Adjust the path as necessary
import { doc, getDoc } from "firebase/firestore";

const PatientsOverview = () => {
  const [couponNumber, setCouponNumber] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatientDetails = async (couponNumber) => {
    setLoading(true);
    setError(null);
    try {
      const couponNumberAsString = String(couponNumber);
      const patientRef = doc(db, "patients", couponNumberAsString);
      const patientSnap = await getDoc(patientRef);

      if (patientSnap.exists()) {
        setPatientDetails(patientSnap.data());
      } else {
        setPatientDetails(null);
        setError("User not found.");
      }
    } catch (err) {
      setError("Failed to fetch patient details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (couponNumber) {
      fetchPatientDetails(couponNumber);
    } else {
      setError("Please enter a coupon number.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">
        Patients Overview
      </h1>

      {/* Coupon Number Input */}
      <div className="flex justify-center items-center mb-6 space-x-4">
        <input
          type="text"
          value={couponNumber}
          onChange={(e) => setCouponNumber(e.target.value)}
          className="border px-4 py-3 rounded-lg shadow-md w-64 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Enter Coupon Number"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-500 transition duration-200"
        >
          Search Patient
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-orange-400">Loading...</p>}

      {/* Error Message */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display Patient Details if Available */}
      {patientDetails && !loading && !error && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Patient Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  Patient Name:
                </span>
                <span className="text-gray-600">
                  {patientDetails.name || "Not Available"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Age:</span>
                <span className="text-gray-600">
                  {patientDetails.age || "Not Available"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  Phone Number:
                </span>
                <span className="text-gray-600">
                  {patientDetails.mobile || "Not Available"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Address:</span>
                <span className="text-gray-600">
                  {patientDetails.address || "Not Available"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Treatments:</span>
                <span className="text-gray-600">
                  {patientDetails.treatments?.join(", ") || "Not Available"}
                </span>
              </div>
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Prescriptions
            </h2>
            <div className="space-y-4">
              {patientDetails.treatments?.map((dept) => (
                <div key={dept} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-700">
                      {dept}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {patientDetails.prescriptions?.[dept] ||
                        "No Prescription"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-700">
                      Remarks
                    </h3>
                    <span className="text-sm text-gray-500">
                      {patientDetails.remarks?.[dept] || "No Remarks"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsOverview;
