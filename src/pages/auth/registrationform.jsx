import { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, getDocs, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState(""); // New state for gender
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [treatmentPrescriptions, setTreatmentPrescriptions] = useState({});
  const [treatmentRemarks, setTreatmentRemarks] = useState({});
  const [error, setError] = useState(null);
  const [couponNumber, setCouponNumber] = useState(null);
  const [step, setStep] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [currentTime, setCurrentTime] = useState(""); // Store registration time
  const navigate = useNavigate();

  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [treatmentError, setTreatmentError] = useState("");

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
    setNameError("");
    setAgeError("");
    setAddressError("");
    setMobileError("");
    setGenderError("");
    setTreatmentError("");

    let formValid = true;

    // Validate the inputs
    if (!name) {
      setNameError("Name is required.");
      formValid = false;
    }
    if (!age || isNaN(age) || age <= 0) {
      setAgeError("Age must be a positive number.");
      formValid = false;
    }
    if (!address) {
      setAddressError("Address is required.");
      formValid = false;
    }
    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
      setMobileError("Mobile number must be 10 digits.");
      formValid = false;
    }
    if (!gender) {
      setGenderError("Gender is required.");
      formValid = false;
    }
    if (selectedTreatments.length === 0) {
      setTreatmentError("Please select at least one treatment.");
      formValid = false;
    }

    if (!formValid) {
      return;
    }

    try {
      const newCouponNumber = await getNextCouponNumber();
      if (newCouponNumber) {
        const userRef = doc(db, "patients", newCouponNumber.toString());

        const userData = {
          name,
          age,
          address,
          mobile,
          gender,
          treatments: selectedTreatments,
          couponNumber: newCouponNumber,
          prescriptions: {},
          remarks: {},
          registrationTime: new Date().toISOString(), // Capture current time in ISO format
        };

        selectedTreatments.forEach((treatment) => {
          userData.prescriptions[treatment] =
            treatmentPrescriptions[treatment] || "NA";
          userData.remarks[treatment] = treatmentRemarks[treatment] || "NA";
        });

        await setDoc(userRef, userData);
        setCouponNumber(newCouponNumber);
        setCurrentTime(new Date().toLocaleString()); // Set the current time when registration is done
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
    <div className="bg-white flex justify-center items-start pt-2 px-2">
      <div className="bg-white rounded-lg w-full max-w-lg px-4 py-2">
        {error && <p className="text-red-500 text-sm mb-1">{error}</p>}

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold text-center text-orange-600 mb-2">
              Patient Registration
            </h2>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-1 border border-orange-600 rounded-md mt-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                required
              />
              {nameError && <p className="text-red-500 text-xs">{nameError}</p>}
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-1 border border-orange-600 rounded-md mt-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                required
              />
              {ageError && <p className="text-red-500 text-xs">{ageError}</p>}
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-1 border border-orange-600 rounded-md mt-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {genderError && <p className="text-red-500 text-xs">{genderError}</p>}
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-1 border border-orange-600 rounded-md mt-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                required
              />
              {addressError && <p className="text-red-500 text-xs">{addressError}</p>}
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Mobile No.
              </label>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-1 border border-orange-600 rounded-md mt-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                required
              />
              {mobileError && <p className="text-red-500 text-xs">{mobileError}</p>}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!name || !age || !address || !mobile || !gender}
              className="w-full bg-orange-600 text-white p-1 rounded-md mt-1 hover:bg-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold text-center text-orange-600 mb-2">
              Select Treatments
            </h3>

            <div className="space-y-2 mb-2">
              {["Ortho", "Cardio", "OPD", "Eye", "Dental"].map((treatment) => (
                <div
                  className="flex justify-between items-center"
                  key={treatment}
                >
                  <label className="text-sm font-medium text-gray-700">
                    {treatment}
                  </label>
                  <input
                    type="checkbox"
                    value={treatment}
                    onChange={handleTreatmentChange}
                    className="form-checkbox h-4 w-4 text-orange-600 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              ))}
            </div>
            {treatmentError && <p className="text-red-500 text-xs">{treatmentError}</p>}

            <button
              type="submit"
              onClick={handleRegister}
              className="w-full bg-orange-600 text-white p-1 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400"
            >
              Register
            </button>
          </>
        )}
      </div>

      {showSuccessPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl text-center max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2 text-orange-600">
              Registration Successful!
            </h3>
            <p className="text-base mb-2">Your Coupon Number is:</p>
            <p className="text-2xl font-bold text-orange-600 mb-3">
              {couponNumber}
            </p>
            <p className="text-base mb-2">Registration Time: {currentTime}</p>
            <button
              onClick={closePopup}
              className="bg-orange-600 text-white px-4 py-1 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400"
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
