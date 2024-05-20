import './AdManualInsert.css';
import Navbar from "./Navbar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

function AdManualInsert() {
  const location = useLocation();
  const [AdUnit, setAdUnit] = useState('');
  const [email, setAdEmail] = useState('');
  const navigate = useNavigate('');
  useEffect(() => {
    const { AdUnit, AdEmail } = location.state || {};
    setAdUnit(AdUnit || '');
    setAdEmail(AdEmail || '');
  }, [location.state]);
  

  // const [manualID, setManualId] = useState('');
  const [theme, setTheme] = useState('');
  const [description , setDescription] = useState('');
  const [absentees , setAbsentees] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [duration, setDuration] = useState('');
  const [Location, setLocation] = useState('');
  const [LO, setLO] = useState('');



const handleInsertManual = async (e) => {
try {
     e.preventDefault();
  await axios.post('http://localhost:5000/Ad/manualInsert', { AdUnit, theme, description, manualDate, duration, Location, LO, absentees});
  console.log('Manual Inserted successful');
  Swal.fire({
    icon: "success",
    title: "Manual Inserted Successfully",
    //text: "You will be Redirected to Login Page",
    //footer: '<a href="#">Why do I have this issue?</a>'
  });
  navigate('/Regres', { state: { email } });
  
  
  
} catch (error) {
  console.error('Error signing up:', error.response.data.error);
  setError('Invalid credentials. Please try again.');
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Invalid credentials. Please try again.",
    
  });
  setAbsentees('');
  setTheme('');
  setDescription('');
  setDuration('');
  setManualDate('');
  setLO('');
      
}}





  return (
    <>
      <Navbar />
      <div className="mibg">
        <div className="wrapper-mi">
          <form action="">
            <h1>New Manual</h1>

            {/* <div className="input-box-mi">
              <input type="int" placeholder="Manual ID" value={manualID} onChange={(e) => setManualId(e.target.value)} required />
            </div> */}
            <div className="input-box-mi">
              <input type="text" placeholder="Theme" value={theme} onChange={(e) => setTheme(e.target.value)} required />
            </div>
            <div className="input-box-mid">
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            </div>
            <div className="input-box-mi">
              <input type="date" placeholder="Date" value={manualDate} onChange={(e) => setManualDate(e.target.value)} required />
            </div>
            <div className="input-box-mi">
              <input type="int" placeholder="Duration in Days" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </div>
            <div className="input-box-mi">
              <input type="text" placeholder="Location" value={Location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className="input-box-mi">
              <input type="text" placeholder="Lead Organizer" value={LO} onChange={(e) => setLO(e.target.value)} required />
            </div>
            <div className="input-box-mid">
              <textarea placeholder="Absentees Role No." value={absentees} onChange={(e) => setAbsentees(e.target.value)} required></textarea>
            </div>

            <button onClick={handleInsertManual}  type='submit'>Register</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdManualInsert;
