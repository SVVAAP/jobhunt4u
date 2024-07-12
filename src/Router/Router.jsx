import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import About from "../Pages/About";
import CreateJob from "../Pages/CreateJob";
import Login from "../components/login"
import Signup from "../components/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/post-job", element: <CreateJob /> },
    ],
  },
  { path: "/login", element:<Login/>},
  {path: "/signup",element:<Signup/>},
]);
export default router;
