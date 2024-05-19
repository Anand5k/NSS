import "./UserManuals.css";
import Navbar from "./Navbar";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function UserManuals() {


    const location = useLocation();
    const [userUnit, setUserUnit] = useState('');

    useEffect(() => {
        const { userUnit } = location.state || {};
        setUserUnit(userUnit || '');  // Default to empty string if rollno is undefined
    }, [location.state]);

    const [manuals, setManuals] = useState([]);
    const [error, setError] = useState('');
    

   


  const fetchManuals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/manuals', {
        params: { unit: userUnit }
      });
      setManuals(response.data.manuals);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching manuals');
      setManuals([]);
    }
  };

  useEffect(() => {
    fetchManuals();
  }, [userUnit]); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div>
      <h1>Manuals Table</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {manuals.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Manual ID</th>
              <th>Unit No</th>
              <th>Theme</th>
              <th>Description</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Location</th>
              <th>Lead Organiser</th>
            </tr>
          </thead>
          <tbody>
            {manuals.map((manual) => (
              <tr key={manual.manual_id}>
                <td>{manual.manual_id}</td>
                <td>{manual.unit_no}</td>
                <td>{manual.theme}</td>
                <td>{manual.description}</td>
                <td>{manual.date.slice(0, 10)}</td>
                <td>{manual.duration}</td>
                <td>{manual.location}</td>
                <td>{manual.lead_organiser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No manuals found</p>
      )}
    </div>
  );



}

export default UserManuals;