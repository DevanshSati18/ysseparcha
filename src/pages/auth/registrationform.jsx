import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, getDocs, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [treatmentPrescriptions, setTreatmentPrescriptions] = useState({});
  const [treatmentRemarks, setTreatmentRemarks] = useState({});
  const [error, setError] = useState(null);
  const [couponNumber, setCouponNumber] = useState(null);
  const [step, setStep] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const getNextCouponNumber = async () => {
    try {
      const usersRef = collection(db, "patients");
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);

      let maxCoupon = 0;
      querySnapshot.forEach((doc) => {
        const patientData = doc.data();
        if (patientData.couponNumber > maxCoupon) {
          maxCoupon = patientData.couponNumber;
        }
      });

      return maxCoupon + 1;
    } catch (error) {
      console.error("Error fetching coupon number: ", error);
      setError("Could not fetch coupon number.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const newCouponNumber = await getNextCouponNumber();
      if (newCouponNumber) {
        const userRef = doc(db, "patients", newCouponNumber.toString());

        const userData = {
          name,
          age,
          address,
          mobile,
          treatments: selectedTreatments,
          couponNumber: newCouponNumber,
          prescriptions: {},
          remarks: {},
        };

        selectedTreatments.forEach((treatment) => {
          userData.prescriptions[treatment] = treatmentPrescriptions[treatment] || "NA";
          userData.remarks[treatment] = treatmentRemarks[treatment] || "NA";
        });

        await setDoc(userRef, userData);
        setCouponNumber(newCouponNumber);
        setShowSuccessPopup(true);
      }
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  const handleTreatmentChange = (e) => {
    const value = e.target.value;
    setSelectedTreatments((prevTreatments) =>
      prevTreatments.includes(value)
        ? prevTreatments.filter((treatment) => treatment !== value)
        : [...prevTreatments, value]
    );
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 overflow-hidden">
        
        

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Step 1: User Data Form */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-semibold text-center text-orange-600 mb-4">Patient Registration</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border border-orange-600 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="w-full p-4 border border-orange-600 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="w-full p-4 border border-orange-600 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="w-full p-4 border border-orange-600 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-orange-600 text-white p-4 rounded-md mt-4 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              Next
            </button>
          </>
        )}

        {/* Step 2: Medical Check-up Form */}
        {step === 2 && (
          <>
            <h3 className="text-xl font-semibold text-center text-orange-600 mb-4">Select Treatments</h3>

            <div className="space-y-4">
              {["Ortho", "Cardio", "OPD", "Eye", "Dental"].map((treatment) => (
                <div className="flex justify-between items-center" key={treatment}>
                  <label className="text-lg font-medium text-gray-700">{treatment}</label>
                  <input
                    type="checkbox"
                    value={treatment}
                    onChange={handleTreatmentChange}
                    className="form-checkbox h-5 w-5 text-orange-600 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              onClick={handleRegister}
              className="w-full bg-orange-600 text-white p-4 rounded-md mt-4 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
            <h3 className="text-2xl font-semibold mb-4 text-orange-600">Registration Successful!</h3>
            <p className="text-xl mb-4">Your Coupon Number is:</p>
            <p className="text-4xl font-bold text-orange-600 mb-6">{couponNumber}</p>
            <button
              onClick={closePopup}
              className="bg-orange-600 text-white p-4 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
