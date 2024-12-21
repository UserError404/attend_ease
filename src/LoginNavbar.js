import { createBrowserRouter, Routes, Route, Link, createRoutesFromElements, NavLink } from "react-router-dom";

const LoginNavbar = () => {
    return ( 
        <nav className="Login_Navbar">
            <h1 className="Navbar_Title">AttendEase</h1>
            <ul className="Navbar_Links">
                <li><NavLink to="/">Login</NavLink></li>
                <li><NavLink to="SignUp">Sign Up</NavLink></li>
            </ul>
        </nav>
     );
}
 
export default LoginNavbar;