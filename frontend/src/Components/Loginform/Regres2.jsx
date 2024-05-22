import { useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import Navreg from './Navreg';
import './Regres2.css';


function Regres2() {
    const navigate = useNavigate();
    const location = useLocation();
    

    useEffect(() => {
        const { unitNo } = location.state || {};
        setAdUnit(unitNo || '');  // Default to empty string if rollno is undefined
    }, [location.state]);


  const [AdID, setAdID] = useState('');

  const [AdUnit, setAdUnit] = useState('');
  const [unitManualsConducted, setUnitManualsConducted] =  useState('');
  const [unitGS, setUnitGS]= useState('');
  const [unitJS, setUnitJS]= useState('');
  const [unitVolunteers, setUnitVolunteers]= useState('');
  

 
  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/Ad/unitDetails`,{
            params: { unit: AdUnit },
          }
        );
        setUnitManualsConducted(response.data.unitManualsConducted);
        setUnitGS(response.data.unitGS);
        setUnitJS(response.data.unitJS);
        setUnitVolunteers(response.data.unitVolunteers);

      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (AdUnit) {
      fetchUnitDetails();
    }
  }, [AdUnit]);


  const goToAttendenceDetails = () => {
    navigate('/Ad/attendence', { state: { AdUnit } });
  };
  const goToUnitManuals = () => {
    navigate('/Ad/manuals', { state: { AdUnit } });
  }; 
  
  const goToVolunteersDetails = () => {
    navigate('/Ad/volunteersDetails', { state: { AdUnit } });
  };

  const handleUpdateProgramOfficer = (e) => {
    e.preventDefault();
    navigate('/Ad/update', { state: { AdUnit } });
  };

  return (
    <>
      <Navreg />
      <div className="lgrbg">
        {/* <div className="tl">
          <div className="tt3">Welcome</div>
          <div className="tt4">{AdName}!</div>
        </div> */}
        <div className="wrapper-lgr">
        <center><div className="label-input-pair">
            <label>Unit:</label>
            <input type="text" value={AdUnit} readOnly />
          </div></center>
          {/* <div className="label-input-pair">
            <label>Admin ID:</label>
            <input type="text" value={AdID} readOnly />
          </div> */}
          <div className="label-input-pair">
            <label>Volunteers in Unit:</label>
            <input type="text" value={unitVolunteers} readOnly />
          </div>
          <div className="label-input-pair">
            <label>Manuals Conducted:</label>
            <input type="text" value={unitManualsConducted} readOnly />
          </div>
          <div className="label-input-pair">
            <label>GS:</label>
            <input type="text" value={unitGS} readOnly />
          </div>
          <div className="label-input-pair">
            <label>JS:</label>
            <input type="text" value={unitJS} readOnly />
          </div>

          {/* <div className="Rememberlg1"> */}
            {/* <button onClick={goToUserDetails}>Personal Details</button> */}
          {/* </div> */}
          {/* <div className="Rememberlg2"> */}
            {/* <Link to="/user/manuals">Manual Details</Link> */}
          {/* </div> */}
          {/* <div className="Rememberlg2"> */}
            {/* <button onClick={goToUserManuals}>Unit Manuals</button> */}
          {/* </div> */}
          <div className="Rememberlg1">
            <button onClick={goToAttendenceDetails}>Attendence Details</button>
          </div>
          
          <div className="Rememberlg2">
            <button onClick={goToUnitManuals}>Manuals Details</button>
          </div>

          
          <div className="Rememberlg2">
            <button onClick={goToVolunteersDetails}>Volunteers Details</button>
          </div>

          <div className="Rememberlg2">
            <button onClick={handleUpdateProgramOfficer}>Update Program Officer</button>
          </div>
          


        </div>
      </div>
    </>
  );
}

export default Regres2;
