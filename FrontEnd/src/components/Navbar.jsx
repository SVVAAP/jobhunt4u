// Navbar.js
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import logo from '../assets/logo.png';
import { useJobs } from '../context/jobsContext';
import profpic from '../assets/profile.png';
import { useNavigate } from 'react-router-dom';
import Inbox from './inbox';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, mark } = useJobs();
  let isEmployer = false;
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get the current path


  if (isLoggedIn) {
    if (user && (user.userType !== "candidate")) {
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
        navigate('/'); // Redirect to home after logout
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  const handleLinkClick = (link) => {
    if (link.startsWith('#')) {
      const element = document.getElementById(link.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(link);
    }
    setIsMenuOpen(false); // Close the menu
  };

  const navItems = [
    { link: "/", title: "Home", icon: <i className="fa-solid fa-house"></i> },
    ...(location.pathname === '/' ? [{ link: "#search", title: isEmployer ? "View Applicants" :"Find Jobs", icon: <i className="fa-solid fa-magnifying-glass"></i> }] : []),
    ...(location.pathname === '/' ? [{ link: "#about", title: "About Us", icon: <i className="fa-solid fa-circle-info"></i> }] : []),
    ...(isEmployer ? [{ link: "/post-job", title: "Post A Job", icon: <i className="fa-solid fa-briefcase"></i> }] : []),
  ];

  return (
    <div className='flex justify-center'>
    <header className="max-w-screen-2xl container xl:px-12 px-4 bg-white/85 shadow-md rounded-b-lg">
      <nav className="flex justify-between items-center py-3">
        <Link to="/" className="flex items-center gap-2 text-2xl text-black">
          <img src={logo} className='w-32' alt="Logo" />
        </Link>
        <ul className="hidden md:flex gap-8">
          {navItems.map(({ link, title, icon }) => (
            <li key={link} className="text-base text-primary flex items-center gap-2">
              <NavLink
                to={link}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => handleLinkClick(link)}
              >
                {icon} {title}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="text-base text-primary font-medium space-x-5 hidden lg:block">
          {isLoggedIn ? (
            <div className='flex items-center gap-3'>
              <Inbox /> {/* Add the Inbox component here */}
              <Link to={isEmployer ? "/profile-emp" : "/profile"}>
                <img className='h-8 w-8 rounded-full' src={profpic} alt='Profile' />
              </Link>
            </div>
          ) : (
            <div className='flex justify-normal space-x-1'>
              <Link to="/login" className="py-2 px-5 border rounded flex items-center gap-2">
                <i className="fa-solid fa-right-to-bracket"></i> Log in
              </Link>
              <Link to="/signup" className="bg-sky-600 py-2 text-white px-5 border rounded flex items-center gap-2">
                <i className="fa-solid fa-user-plus"></i> Sign up
              </Link>
            </div>
          )}
        </div>
        <div className="md:hidden block">
          <button onClick={handleMenuToggler}>
            {isMenuOpen ? (
              <i className="fa-solid fa-xmark w-5 h-5 text-primary/75"></i>
            ) : (
              <i className="fa-solid fa-bars-staggered w-5 h-5 text-primary/75"></i>
            )}
          </button>
        </div>
      </nav>
      <div className={`px-4 bg-blend-screen py-5 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
        <ul>
          {navItems.map(({ link, title, icon }) => (
            <li key={link} className="text-base py-2 flex items-center gap-2">
              <NavLink
                onClick={() => handleLinkClick(link)}
                to={link}
                className={({ isActive }) => (isActive ? "active" : "text-black")}
              >
                {icon} {title}
              </NavLink>
            </li>
          ))}
          {isLoggedIn ? (
            <>
             <Inbox />
              {location.pathname !== "/profile"  ?
              (<li className=" py-2 flex justify-normal items-center gap-2">
                <Link to={isEmployer ? "/profile-emp" : "/profile"}>
                  <i className="fa-solid fa-user"></i> <span>Profile</span>
                </Link>
              </li>):(<></>) }
            </>
          ) : (
            <>
              <li className=" py-2 flex items-center gap-2">
                <Link to="/login" onClick={handleMenuToggler} className="flex items-center gap-2">
                  <i className="fa-solid fa-right-to-bracket"></i> Log in
                </Link>
              </li>
              <li className=" py-2 flex items-center gap-2">
                <Link to="/signup" onClick={handleMenuToggler} className="flex items-center gap-2">
                  <i className="fa-solid text-black fa-user-plus"></i> Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
    </div>
  );
};

export default Navbar;
