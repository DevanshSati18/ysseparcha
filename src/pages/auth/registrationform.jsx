import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig"; // Firebase Firestore import
import { collection, query, getDocs, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  // Step 1: User Data State
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  // Step 2: Medical Check-up State
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [error, setError] = useState(null);
  const [couponNumber, setCouponNumber] = useState(null); // Store generated coupon number
  const [step, setStep] = useState(1); // 1 = User Data, 2 = Medical Data
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // To toggle success popup visibility
  const navigate = useNavigate();

  // Function to get the largest coupon number from Firestore
  const getNextCouponNumber = async () => {
    try {
      const usersRef = collection(db, "patients");
      const q = query(usersRef); // Query all users (patients)
      const querySnapshot = await getDocs(q);

      let maxCoupon = 0;
      querySnapshot.forEach((doc) => {
        const patientData = doc.data();
        if (patientData.couponNumber > maxCoupon) {
          maxCoupon = patientData.couponNumber;
        }
      });

      return maxCoupon + 1; // Return the next coupon number
    } catch (error) {
      console.error("Error fetching coupon number: ", error);
      setError("Could not fetch coupon number.");
    }
  };

  // Handle form submission and user creation
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const newCouponNumber = await getNextCouponNumber(); // Fetch the next coupon number
      if (newCouponNumber) {
        // Create a user document in Firestore using the coupon number as primary key
        const userRef = doc(db, "patients", newCouponNumber.toString()); // Using couponNumber as doc ID
        await setDoc(userRef, {
          name,
          age,
          address,
          mobile,
          treatments: selectedTreatments,
          couponNumber: newCouponNumber, // Store the generated coupon number
        });

        setCouponNumber(newCouponNumber); // Set coupon number for popup display
        setShowSuccessPopup(true); // Show success popup
      }
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  // Handle treatment selection (checkboxes)
  const handleTreatmentChange = (e) => {
    const value = e.target.value;
    setSelectedTreatments((prevTreatments) =>
      prevTreatments.includes(value)
        ? prevTreatments.filter((treatment) => treatment !== value)
        : [...prevTreatments, value]
    );
  };

  // Close the success popup after some time or when clicked
  const closePopup = () => {
    setShowSuccessPopup(false);
    navigate("/dashboard"); // Navigate to dashboard or another page after success
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Step 1: User Data Form */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Patient Registration</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Mobile No.</label>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-3 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-blue-500 text-white p-3 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Next
            </button>
          </>
        )}

        {/* Step 2: Medical Check-up Form */}
        {step === 2 && (
          <>
            <h3 className="text-xl font-semibold text-center mb-6">Select Treatments</h3>

            <div className="space-y-4">
              {/* Treatment Options with Flexbox Layout */}
              {["Ortho", "Cardio", "OPD", "Eye", "Dental"].map((treatment) => (
                <div className="flex justify-between items-center" key={treatment}>
                  <label className="text-lg font-medium text-gray-700">{treatment}</label>
                  <input
                    type="checkbox"
                    value={treatment}
                    onChange={handleTreatmentChange}
                    className="form-checkbox h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              onClick={handleRegister}
              className="w-full bg-green-500 text-white p-3 rounded-md mt-6 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4">Registration Successful!</h3>
            <p className="text-xl mb-4">Your Coupon Number is:</p>
            <p className="text-4xl font-bold text-blue-500 mb-6">{couponNumber}</p>
            <button
              onClick={closePopup}
              className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
