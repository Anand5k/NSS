import './Navbar.css';

const Navlog = () => {
    return(
        <header className='header'>
        <a href="#" className='logo'>NSS</a>
        
        <nav className='navbar'>
            <a href="/">HOME</a>
            <a href="/register">REGISTER</a>
            <a href="/adlogin">PROGRAM OFFICER</a>
            <a href="/siteAdmin">ADMIN</a>
            </nav></header>

    )

}
export default Navlog;