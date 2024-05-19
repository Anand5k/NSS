import './Regres.css';
import Navbar from './Navbar'
function Regres () {
    return(
        <>
        <Navbar/>
    <div className="rrgbg">
        <div className='wrapper-rrg'>
                <h1>Successfully Signed up!</h1>

                <div className='reglink'>
                    <p>Need to Login? <a href="/login">Clickhere</a></p>
                </div>
                <div className='reglink'>
                    <p>Need Homepage? <a href="/">Clickhere</a></p>
                </div>
        </div>
    </div>
    </>

);
}

export default Regres;