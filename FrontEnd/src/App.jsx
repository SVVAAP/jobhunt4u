import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor"; // Adjust the path as necessary
import { useJobs } from "./context/jobsContext";
import Loading from "./components/Loading";

function App() {
  const { isLoading } = useJobs();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <Outlet />
        </>
      )}
    </>
  );
}

export default App;
