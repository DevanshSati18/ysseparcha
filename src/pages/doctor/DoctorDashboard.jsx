import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const [couponNumber, setCouponNumber] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [prescriptions, setPrescriptions] = useState({});
  const [selectedDept, setSelectedDept] = useState("");
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();

  const fetchPatientDetails = async (couponNumber) => {
    setLoading(true);
    setError(null);
    try {
      const patientRef = doc(db, "patients", couponNumber);
      const patientSnap = await getDoc(patientRef);

      if (patientSnap.exists()) {
        const patientData = patientSnap.data();
        setPatientDetails(patientData);
        const departmentsList = patientData.treatments || [];
        const uniqueDepartments = [...new Set(departmentsList)];
        setDepartments(uniqueDepartments);
        setRemarks(patientData.remarks || {});
        setPrescriptions(patientData.prescriptions || {});
      } else {
        setPatientDetails(null);
        setError("Patient not found.");
      }
    } catch (err) {
      setError("Failed to fetch patient details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!patientDetails) {
      setError("No patient data found.");
      return;
    }
    try {
      const patientRef = doc(db, "patients", couponNumber);
      await updateDoc(patientRef, {
        prescriptions: prescriptions,
        remarks: remarks,
      });
      setError("Data saved successfully!");
    } catch (err) {
      setError("Failed to save data.");
    }
  };

  const handleInputChange = (dept, type, value) => {
    if (type === "remark") {
      setRemarks({
        ...remarks,
        [dept]: value,
      });
    } else if (type === "prescription") {
      setPrescriptions({
        ...prescriptions,
        [dept]: value,
      });
    }
  };

  const handleSearch = () => {
    if (couponNumber) {
      fetchPatientDetails(couponNumber);
    } else {
      setError("Please enter a coupon number.");
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-orange-400 text-white shadow-md flex items-center justify-between px-8 py-4">
        <h1 className="text-3xl font-semibold tracking-wider">
          Doctor Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold text-sm transition duration-200 shadow-md"
        >
          Logout
        </button>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="flex justify-center items-center mb-6 space-x-4">
          <input
            type="text"
            value={couponNumber}
            onChange={(e) => setCouponNumber(e.target.value)}
            className="border border-gray-300 rounded-lg py-3 px-4 w-full sm:w-72 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Enter Coupon Number"
          />
          <button
            onClick={handleSearch}
            className="bg-orange-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-400 transition duration-200 w-full sm:w-auto"
          >
            Search Patient
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && <p className="text-center text-orange-400">Loading...</p>}

        {/* Error Message */}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Patient Details Section */}
        {patientDetails && !loading && !error && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
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
                  <span className="font-semibold text-gray-700">
                    Treatments:
                  </span>
                  <span className="text-gray-600">
                    {patientDetails.treatments?.join(", ") || "Not Available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Department Dropdown and Prescription Section */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Prescriptions and Remarks
              </h2>
              <div className="space-y-6">
                {/* Department Dropdown */}
                <div className="flex justify-between items-center mb-6">
                  <label className="font-semibold text-gray-700">
                    Select Department:
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full sm:w-64 p-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prescription and Remarks for Selected Department */}
                {selectedDept && (
                  <div className="space-y-6">
                    <div className="flex flex-col space-y-4">
                      <div className="space-y-2">
                        <label className="font-semibold text-gray-700">
                          Prescription:
                        </label>
                        <textarea
                          value={prescriptions[selectedDept] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              selectedDept,
                              "prescription",
                              e.target.value
                            )
                          }
                          className="w-full p-4 border rounded-lg resize-none shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                          rows="5"
                          placeholder="Enter Prescription"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-semibold text-gray-700">
                          Remarks:
                        </label>
                        <textarea
                          value={remarks[selectedDept] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              selectedDept,
                              "remark",
                              e.target.value
                            )
                          }
                          className="w-full p-4 border rounded-lg resize-none shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                          rows="5"
                          placeholder="Enter Remarks"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Data Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-200 w-full sm:w-auto"
              >
                Save Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
