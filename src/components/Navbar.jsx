import React, { useState} from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { getAuth,  signOut } from 'firebase/auth';
import logo from '../assets/logo.png';
import { useJobs } from '../context/jobsContext';
import profpic from '../assets/profile.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {isLoggedIn,user}=useJobs();
  let isEmployer = false; // Changed to let to allow reassignment
  const auth = getAuth();

  if (isLoggedIn) {
    if (user && (user.userType === "employer" || user.userType === "admin")) {
      isEmployer = true;
    }
  }
    
  const handleMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  const navItems = [
    { path: "/", title: "Home" },
    { path: "#search", title: "Find Jobs" },
    { path: "/about", title: "About Us" },
    ...(isEmployer ? [{ path: "/post-job", title: "Post A Job" }] : []),
  ];

  return (
    <header className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <nav className="flex justify-between items-center py-6">
        <a href="/" className="flex items-center gap-2 text-2xl text-black">
          <img src={logo} className='w-32 shadow' alt="Logo" />
        </a>
        <ul className="hidden md:flex gap-12">
          {navItems.map(({ path, title }) => (
            <li key={path} className="text-base text-primary">
              <NavLink
                to={path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {title}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="text-base text-primary font-medium space-x-5 hidden lg:block">
          {isLoggedIn ? (
            // <button onClick={handleLogout} className="py-2 px-5 border rounded">
            //   Log out
            // </button>
            <div><Link to="/profile"><img className='h-5' src={profpic}alt='prof'/></Link></div>
          ) : (
            <>
              <Link to="/login" className="py-2 px-5 border rounded">
                Log in
              </Link>
              <Link to="/signup" className="bg-blue py-2 px-5 text-white rounded">
                Sign up
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden block">
          <button onClick={handleMenuToggler}>
            {isMenuOpen ? (
              <FaXmark className="w-5 h-5 text-primary/75" />
            ) : (
              <FaBarsStaggered className="w-5 h-5 text-primary/75" />
            )}
          </button>
        </div>
      </nav>
      <div className={`px-4 bg-black py-5 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
        <ul>
          {navItems.map(({ path, title }) => (
            <li key={path} className="text-base text-white first:text-white py-1">
              <NavLink
                onClick={handleMenuToggler}
                to={path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {title}
              </NavLink>
            </li>
          ))}
          {isLoggedIn ? (
            <li className="text-white py-1">
              <button onClick={handleLogout}>Log out</button>
            </li>
            
          ) : (
            <>
              <li className="text-white py-1">
                <Link to="/login" onClick={handleMenuToggler}>
                  Log in
                </Link>
              </li>
              <li className="text-white py-1">
                <Link to="/signup" onClick={handleMenuToggler}>
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
