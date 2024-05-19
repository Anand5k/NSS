
import './App.css'
import Home from './Components/Loginform/Home'
import Loginform from './Components/Loginform/Loginform';
import { Route, Routes } from "react-router-dom";
import ForgetPassword from './Components/Loginform/ForgetPassword';
import Registerform from './Components/Loginform/Registerform'
import Adlogin from './Components/Loginform/Adlogin'
import Logres from './Components/Loginform/Logres'
import Regres from './Components/Loginform/Regres'
import UserDetails from './Components/Loginform/UserDetails'
import UserManuals from './Components/Loginform/UserManuals'
import InsertManuals from './Components/Loginform/InsertManuals'
import AdManuals from './Components/Loginform/AdManuals'
import AdAttendence from './Components/Loginform/AdAttendence'
function App() {
  return (
    <div className="full">
      <Routes>
        <Route key={1} index path='/' element={<Home/>}></Route>
        <Route key={2} index path='/register' element={< Registerform/>}></Route>
        <Route key={3} index path='/login' element={<Loginform/>}></Route>
        <Route key={4} index path='/adlogin' element={<Adlogin/>}></Route>
        <Route key={5} index path='/logres' element={<Logres/>}></Route>
        <Route key={9} index path='/regres' element={<Regres/>}></Route> 
        <Route key={6} index path='/forgetPassword' element={<ForgetPassword/>}></Route>
        <Route key={7} index path='/user/details' element={<UserDetails/>}></Route>
        <Route key={8} index path='/user/manuals' element={<UserManuals/>}></Route>
        <Route key={10} index path='/Ad/insert_manuals' element={<InsertManuals/>}></Route>
        <Route key={11} index path='/Ad/manuals' element={<AdManuals/>}></Route>
        <Route key={12} index path='/Ad/attendence' element={<AdAttendence/>}></Route>
      </Routes>
    </div>
  );
}


export default App
