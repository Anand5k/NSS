import './Navbar.css';

const Navad = () => {
    return(
        <header className='header'>
        <a href="#" className='logo'>NSS</a>
        
        <nav className='navbar'>
            <a href="/">HOME</a>
           
            <a href="/login">STUDENT</a>
            <a href="/siteAdmin">ADMIN</a>
            </nav></header>

    )

}
export default Navad;