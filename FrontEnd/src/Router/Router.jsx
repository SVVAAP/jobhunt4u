import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import CreateJob from "../Pages/CreateJob";
import Login from "../components/login"
import Signup from "../components/Signup";
import PrivateRoute from "../components/PrivateRout";
import Manager from "../Pages/Manager";
import Applicants from "../components/Applicants";
import EmployeerDetails from "../components/EmployeerDetails";
import JobList from "../components/JobList";
import SingleJob from "../Pages/SingleJob";
import Profile from "../Pages/Profile";
import Login2 from "../components/login2";
import ProfileEmp from "../Pages/ProfileEmp";
import Home_toggle from "../components/home_toggle";
import EmpApplicants from "../Pages/EmpApplicants";
import EditePage from "../Pages/EditePage";
import Candidate from "../components/Candidate";
import MyJobs from "../components/MyJobs";
import NotFound from '../components/404';
import TermsAndCondition from "../components/TermsAndConditions";
import TestPage from "../components/TestPage";
//import Policy from "../components/PrivacyPolicy";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      { path: "/", element: <Home_toggle /> },
      { path: "/post-job", element: <CreateJob /> },
    ],
  },
  { path: "/profile", element: <Profile /> },
  { path: "/profile-emp", element: <ProfileEmp /> },
  { path: "/login", element: <Login /> },
  { path: "/login-admin", element: <Login2 /> },
  { path: "/signup", element: <Signup /> },
  { path: "/Terms&Condition", element: <TermsAndCondition /> },
  { path: "/test", element: <TestPage/> },
 //{ path: "/PrivacyPolicy", element: <Policy /> },
  {
    path: "/jobhunt4u-admin", element: <PrivateRoute element={Manager} />,
    children: [
      { path: "/jobhunt4u-admin/", element: <JobList /> },
      { path: "/jobhunt4u-admin/applicants", element: <Applicants /> },
      { path: "/jobhunt4u-admin/employer", element: <EmployeerDetails /> },
      { path: "/jobhunt4u-admin/addjob", element: <CreateJob /> },
      { path: "/jobhunt4u-admin/site-content", element: <EditePage /> },
      { path: "/jobhunt4u-admin/candidate", element: <Candidate /> },
      { path: "/jobhunt4u-admin/my-jobs", element: <MyJobs /> }
    ]
  },
  { path: "/singlejob/:jobId", element: <SingleJob /> },
  { path: "/applicants/:jobId", element: <EmpApplicants /> },
  { path: "*", element: <NotFound /> },
]);
export default router;
