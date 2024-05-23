import './Loginform.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2'
import Navlog from './Navlog'
function Loginform () {
  const [rollno, setRollno] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError]= useState('');
  const history = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { rollno, password });
      console.log('Login successful');
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Login Successfully",
        showConfirmButton: false,
        timer: 2000
      });
      history(`/logres`, { state: { rollno } });
      
    } catch (error) {
      console.error('Error logging in:', error.response.data.error);
      setError('Invalid credentials. Please try again.');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid Email or Password",
        
      });
      setRollno('');
      setPassword('');
    }
};
    return(
      <>
      <Navlog/>
        <div className="lnbg">
            <div className='wrapper-lg'>
                <form onSubmit={handleLogin}>
                    <h1>Sign in</h1>
                    <div className='input-box'>
                        <input type='int' placeholder='Rollno' value={rollno} onChange={(e) => setRollno(e.target.value)} required />
                        <FaUser className='icon'/>
                    </div>
                    <div className='input-box'>
                        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <RiLockPasswordFill className='icon'/>
                    </div>

                    <div className='Remember'>
                        <a href="/forgetPassword">Forgot Password?</a>
                    </div>

                    <button>Login</button>

                    <div className='reglink'>
                        <p>New User? <a href="/register">Register</a></p>
                    </div>

                </form>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                        {error && <div className="error">{error}</div>}
                    </div>


            </div>
        </div>
        </>
    );
}

export default Loginform;