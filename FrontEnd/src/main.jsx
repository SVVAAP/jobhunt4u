// import ReactDOM from 'react-dom/client'
// import './index.css'
// import { RouterProvider } from 'react-router-dom'
// import router from './Router/Router.jsx'
// import { JobsProvider } from './context/jobsContext.jsx'



// ReactDOM.createRoot(document.getElementById('root')).render(
//   <JobsProvider>
//   <RouterProvider router={router} />
//   </JobsProvider>

// )


import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router.jsx"; // Ensure router is correctly set up
import { JobsProvider } from "./context/JobsContext.jsx";
import './index.css';

// Use createRoot for React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <JobsProvider>
      <RouterProvider router={router} />
    </JobsProvider>
  </React.StrictMode>
);
