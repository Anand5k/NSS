import './Navbar.css';

const Navbar = () => {
    return(
        <header className='header'>
        <a href="#" className='logo'>LOGO</a>
        
        <nav className='navbar'>
            <a href="/">HOME</a>
            <a href="/register">REGISTER</a>
            <a href="/login">STUDENT</a>
            <a href="/adlogin">ADMIN</a>
            <a href="/login">CONTACT</a>
            </nav></header>

    )

}
export default Navbar;