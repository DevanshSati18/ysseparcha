import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const PatientList = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      setPatients(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchPatients();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">Patient Records</h2>
      <ul className="mt-4">
        {patients.map((patient, index) => (
          <li key={index} className="p-2 border-b">
            {patient.name} - {patient.age} years old
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
