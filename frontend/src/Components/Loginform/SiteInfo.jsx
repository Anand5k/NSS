import './SiteAdmin.css';
import Navlog from "./Navlog";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SiteInfo() {
  const [units, setUnits] = useState([]);
  const [unitNo, setUnitNo] = useState('');
  const [error, setError] = useState('');
  const [maxUnitNo, setMaxUnitNo] = useState(0);
  const navigate = useNavigate();

  const fetchUnits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/unit');
      const fetchedUnits = response.data.unit;
      setUnits(fetchedUnits);
      setMaxUnitNo(Math.max(...fetchedUnits.map(unit => unit.unit_no)));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching Unit Details');
      setUnits([]);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleUnitNoChange = (e) => {
    setUnitNo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(unitNo) > maxUnitNo) {
      setError(`Unit No. ${unitNo} exceeds the maximum Unit No. ${maxUnitNo}`);
    } else {
      navigate('/regres2', { state: { unitNo } });
    }
  };



  return (
    <>
      <Navlog />
      <div className="usrmbg">
        <h1>Unit Details</h1>
        
        <table className="manuals-table">
          <thead>
            <tr>
              <th>Unit No.</th>
              <th>Program Officer</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.unit_no}>
                <td>{unit.unit_no}</td>
                <td>{unit.name}</td>
                <td>{unit.designation}</td>
                <td>{unit.department}</td>
                <td>{unit.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>For More Details</h2>
        <div className="filter-section">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={unitNo}
              onChange={handleUnitNoChange}
              placeholder="Enter Unit No."
              className="unit-input"
            />
            <button type="submit" className="filter-button">Submit</button>
          </form>
        </div>
        <div className="update-section">
        {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default SiteInfo;
