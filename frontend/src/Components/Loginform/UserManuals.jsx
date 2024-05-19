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
        setUserUnit(userUnit || '');
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
        if (userUnit) {
            fetchManuals();
        }
    }, [userUnit]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <Navbar />
            <div className="usrmbg">
                <h1>Manuals Table</h1>
                {error && <p className="error-message">{error}</p>}
                {manuals.length > 0 ? (
                    <table className="manuals-table">
                        <thead>
                            <tr>
                                <th>Manual ID</th>
                                <th>Theme</th>
                                <th className="description-col">Description</th>
                                <th className="date-col">Date</th>
                                <th>Duration</th>
                                <th>Location</th>
                                <th>Lead Organiser</th>
                            </tr>
                        </thead>
                        <tbody>
                            {manuals.map((manual) => (
                                <tr key={manual.manual_id}>
                                    <td>{manual.manual_id}</td>
                                    <td>{manual.theme}</td>
                                    <td>{manual.description}</td>
                                    <td>{formatDate(manual.date)}</td>
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
        </>
    );
}

export default UserManuals;
