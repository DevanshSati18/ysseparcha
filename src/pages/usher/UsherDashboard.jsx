import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/firebaseConfig'; // Firebase imports

const UsherDashboard = () => {
  const [departments] = useState(['cardio', 'dental', 'ent', 'eye', 'opd', 'ortho']); // Static department list
  const [selectedDept, setSelectedDept] = useState(null);
  const [queue, setQueue] = useState([]);
  const [missing, setMissing] = useState([]);
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const [coupon, setCoupon] = useState('');
  const [lastFetchedDoc, setLastFetchedDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for progress bar
  const [successMessage, setSuccessMessage] = useState(''); // Success message
  const navigate = useNavigate();

  // Fetch patients from the selected department
  const fetchPatientsFromDept = async (dept, loadMore = false) => {
    setIsLoading(true); // Start loading
    try {
      const deptDoc = await getDoc(doc(db, 'waiting', dept));
      if (deptDoc.exists()) {
        const queueList = deptDoc.data().list || [];
        const missingList = deptDoc.data().missing || [];

        const patientsData = await fetchPatientsDetails(queueList);
        const missingData = await fetchPatientsDetails(missingList);

        setQueue(patientsData);
        setMissing(missingData);

        if (loadMore && patientsData.length > 0) {
          setLastFetchedDoc(patientsData[patientsData.length - 1]);
        }
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false); // Stop loading when data is fetched
    }
  };

  // Helper function to fetch patient details from the coupons
  const fetchPatientsDetails = async (couponList) => {
    const patientsData = [];

    for (let couponNumber of couponList) {
      const patientDoc = await getDoc(doc(db, 'patients', couponNumber.toString())); // Ensure coupon is a string
      if (patientDoc.exists()) {
        const patientData = patientDoc.data();
        patientsData.push({
          couponNumber,
          name: patientData.name,
          address: patientData.address,
          age: patientData.age,
          gender: patientData.gender,
        });
      }
    }

    return patientsData;
  };

  // Add patient to the queue
  const addPatientToQueue = async () => {
    if (coupon.trim()) {
      setIsLoading(true); // Show loading spinner
      try {
        // Add the coupon number to the department's queue list
        await updateDoc(doc(db, 'waiting', selectedDept), {
          list: arrayUnion(coupon),
        });

        // Clear the input field and show success message
        setCoupon('');
        setSuccessMessage(`Coupon ${coupon} added successfully to the queue!`);
        setTimeout(() => {
          setSuccessMessage(''); // Hide success message after 5 seconds
        }, 5000);

        // Fetch updated patient list from the department
        fetchPatientsFromDept(selectedDept);
      } catch (error) {
        console.error('Error adding patient to queue:', error);
      } finally {
        setIsLoading(false); // Hide loading spinner
      }
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Remove patient from queue
  const removePatientFromQueue = async (index) => {
    const couponNumber = queue[index].couponNumber;
    try {
      await updateDoc(doc(db, 'waiting', selectedDept), {
        list: arrayRemove(couponNumber),
      });
      setQueue(queue.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing patient from queue:', error);
    }
  };

  // Send patient to missing list
  const sendToMissing = async (index) => {
    const couponNumber = queue[index].couponNumber;
    try {
      await updateDoc(doc(db, 'waiting', selectedDept), {
        missing: arrayUnion(couponNumber),
        list: arrayRemove(couponNumber),
      });
      setMissing([...missing, queue[index]]);
      setQueue(queue.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error sending to missing list:', error);
    }
  };

  // Remove patient from missing list
  const removeFromMissingList = async (index) => {
    const couponNumber = missing[index].couponNumber;
    try {
      await updateDoc(doc(db, 'waiting', selectedDept), {
        missing: arrayRemove(couponNumber),
      });
      setMissing(missing.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing from missing list:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-orange-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold">Usher Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800 transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            {/* Department Dropdown */}
            <select
              onChange={(e) => {
                setSelectedDept(e.target.value);
                fetchPatientsFromDept(e.target.value);
              }}
              value={selectedDept || ''}
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Queue/Missing List with visual shading for active state */}
          <div className="mb-6 flex">
            <button
              onClick={() => setSelectedListIndex(0)}
              className={`flex-1 text-center py-2 rounded-md ${
                selectedListIndex === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              } hover:bg-blue-500 transition duration-300 mr-2`}
            >
              Queue
            </button>
            <button
              onClick={() => setSelectedListIndex(1)}
              className={`flex-1 text-center py-2 rounded-md ${
                selectedListIndex === 1
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              } hover:bg-yellow-500 transition duration-300`}
            >
              Missing
            </button>
          </div>

          {/* Coupon Number Input */}
          <div className="mb-6 flex space-x-4 items-center">
            <input
              type="number"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter Coupon Number"
              className="p-3 border border-gray-300 rounded-md w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="999999"
            />
            <button
              onClick={addPatientToQueue}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
            >
              Add Patient to Queue
            </button>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-500 text-white p-3 rounded-md mb-4">
              {successMessage}
            </div>
          )}
        </div>

        {/* Circular Spinner while loading */}
        {isLoading && (
          <div className="flex justify-center items-center space-x-2 py-6">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="text-center text-sm text-gray-500">Loading...</p>
          </div>
        )}

        {/* List of Patients */}
        <div>
          {selectedListIndex === 0 ? (
            <div>
              {queue.length === 0 ? (
                <p>No patients in the queue</p>
              ) : (
                <ul>
                  {queue.map((patient, index) => (
                    <li key={index} className="flex justify-between items-center mb-4 p-4 border-b border-gray-200 rounded-md">
                      <div>
                        <p><strong>Name:</strong> {patient.name}</p>
                        <p><strong>Coupon Number:</strong> {patient.couponNumber}</p>
                        <p><strong>Age:</strong> {patient.age}</p>
                        <p><strong>Gender:</strong> {patient.gender}</p>
                        <p><strong>Address:</strong> {patient.address}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => removePatientFromQueue(index)}
                          className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-700 mr-2"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => sendToMissing(index)}
                          className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-700"
                        >
                          Send to Missing
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div>
              {missing.length === 0 ? (
                <p>No missing patients</p>
              ) : (
                <ul>
                  {missing.map((patient, index) => (
                    <li key={index} className="flex justify-between items-center mb-4 p-4 border-b border-gray-200 rounded-md">
                      <div>
                        <p><strong>Name:</strong> {patient.name}</p>
                        <p><strong>Coupon Number:</strong> {patient.couponNumber}</p>
                      </div>
                      <button
                        onClick={() => removeFromMissingList(index)}
                        className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsherDashboard;
