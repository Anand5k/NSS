import './Navbar.css';

const Navhome = () => {
    return(
        <header className='header'>
        <a href="#" className='logo'>NSS</a>
        
        <nav className='navbar'>
            
            <a href="/register">REGISTER</a>
            <a href="/login">STUDENT</a>
            <a href="/adlogin">PROGRAM OFFICER</a>
            <a href="/siteAdmin">ADMIN</a>
            </nav></header>

    )

}
export default Navhome;