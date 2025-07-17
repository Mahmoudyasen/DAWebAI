

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function test() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/doc');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>List of Doctors</h1>
      <ul>
        {doctors.map(doctor => (
          <li key={doctor.IDDoctor}>
            {doctor.Fname} {doctor.Lname} - {doctor.Specialty}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default test;
