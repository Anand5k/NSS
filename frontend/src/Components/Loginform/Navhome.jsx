import './Navbar.css';

const Navhome = () => {
    return(
        <header className='header'>
        <a href="#" className='logo'>LOGO</a>
        
        <nav className='navbar'>
            <a href="/">ABOUT</a>
            <a href="/register">REGISTER</a>
            <a href="/login">STUDENT</a>
            <a href="/adlogin">ADMIN</a>
            <a href="/login">CONTACT</a>
            </nav></header>

    )

}
export default Navhome;