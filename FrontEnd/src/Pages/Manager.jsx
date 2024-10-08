import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import JobList from "../components/JobList";

function Manager() {
  const navigate = useNavigate();
  const auth = getAuth();
  const handleLogout = async () => {
    try {
     // eslint-disable-next-line no-restricted-globals
      var conf = confirm("Are you sure you want to log out?");
      if (conf === true) {
        signOut(auth)
          .then(() => {
            console.log("User signed out");
            navigate("/");
          })
          .catch((error) => {
            console.error("Error signing out: ", error);
          });
      }
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleLinkClick = (link) => {
    if (link.startsWith("#")) {
      const element = document.getElementById(link.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(link);
    }
  };

  const navItems = [
    { link: "/jobhunt4u-admin/", title: "All Jobs", exact: true },
    { link: "/jobhunt4u-admin/applicants", title: "Applicants" },
    { link: "/jobhunt4u-admin/employer", title: "Employer Details" },
    { link: "/jobhunt4u-admin/candidate", title: "Candidate Details" },
    { link: "/jobhunt4u-admin/addjob", title: "Add Jobs" },
    { link: "/jobhunt4u-admin/site-content", title: "Site Content" },
    { link: "/jobhunt4u-admin/my-jobs", title: "My Jobs"}
  ];

  return (
    <div className="sticky top-0 over" id="">
      <div className=" bg-sky-900  pb-3 rounded-md m-3 ">
        <div className="flex justify-center bg-sky-800 rounded-md">
          <h1 className="text-white text-xl m-0.5 w-fit p-2 rounded-md px-100 ">Admin Console</h1>
        </div>
        <div className="flex justify-center  space-x-5 m-3">
          {/*bg-sky-700 p-2 rounded-lg*/}
          {navItems.map(({ link, title, exact }) => (
            <li key={link} className="text-base text-white font-roboto flex items-center gap-2">
              <NavLink
                to={link}
                end={exact} // Only add the 'end' prop for exact matches
                className={({ isActive }) => "w-fit p-0.5 rounded px-2 " + (isActive ? "bg-white/25" : "")}
                onClick={() => handleLinkClick(link)}>
                {title}
              </NavLink>
            </li>
          ))}
{/* logout */}
          <div className="absolute right-8">
            <button className="float-right h-7 cursor-pointer " onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket text-white text-xl hover:bg-white/25 p-1 px-2 rounded-md"></i>
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Manager;
