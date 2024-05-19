import './Home.css';
import Navbar from './Navbar'
const Home = () => {
    return(
    <>
     <Navbar/> 
        <div className="hmbg">
            <h1>
            <span className='tt1'>Congrats! </span>
            <span className='tt2'>You are one step closer to <br/>serving the society.</span>
            </h1>
        </div>
    </>
    );
};
export default Home;