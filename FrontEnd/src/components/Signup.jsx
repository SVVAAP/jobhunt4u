import React, { useEffect, useState } from "react";
import { auth, database, getDownloadURL, storage, ref as storageRef, uploadBytes } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { get, push, ref, set, update } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com"; // Import EmailJS
import background from "../assets/signin_bg.png";
import card_bg from "../assets/sign_card.png";
import TermsAndConditions from "./TermsAndConditions";
import { stateObject } from "../assets/Country+State+District-City-Data"; // Import the country-state-district data

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [resume, setResume] = useState(null);
  const [logo, setLogo] = useState(false);
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [verified, setVerified] = useState(false);
  const [location, setLocation] = useState({
    country: "",
    state: "",
    district: "",
  });
  const [showConditions, setShowConditions] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false); // State to check Terms acceptance
  const [timer, setTimer] = useState(0); // State to keep track of timer

  const generateCandidateID = async () => {
    const candiCounterRef = ref(database, "candidateCounter");
  
    try {
      const snapshot = await get(candiCounterRef);
      let candidateNumber = 1; // Default starting job number
  
      if (snapshot.exists()) {
        candidateNumber = snapshot.val() + 1;
      }
      // Increment the counter in the database
      await set(candiCounterRef, candidateNumber);
  
      // Format the job number into a job ID, e.g., "JV001"
      return `JC00${String(candidateNumber).padStart(3, "0")}`;
    } catch (error) {
      console.error("Error generating job ID:", error);
      return null;
    }
  };

  const generateEmpID = async () => {
    const empCounterRef = ref(database, "employeeCounter");
  
    try {
      const snapshot = await get(empCounterRef);
      let empNumber = 1; // Default starting job number
  
      if (snapshot.exists()) {
        empNumber = snapshot.val() + 1;
      }
      // Increment the counter in the database
      await set(empCounterRef, empNumber);
  
      // Format the job number into a job ID, e.g., "JV001"
      return `JE${String(empNumber).padStart(3, "0")}`;
    } catch (error) {
      console.error("Error generating job ID:", error);
      return null;
    }
  };
  
  const navigate = useNavigate();
  const countries = Object.keys(stateObject); // Get the list of countries

  const handleCountryChange = (e) => {
    setLocation({ ...location, country: e.target.value, state: "", district: "" });
  };

  const handleStateChange = (e) => {
    setLocation({ ...location, state: e.target.value, district: "" });
  };

  const handleDistrictChange = (e) => {
    setLocation({ ...location, district: e.target.value });
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  };

  const sendOtpEmail = (otp_code) => {
    const templateParams = {
      to_name: name,
      otp: otp_code,
      to_email: email,
    };

    emailjs.send("service_6iar33a", userType==="candidate"?"template_be150gv":"template_gv8hq77", templateParams, "nq0XIkYT4cuoYUKQI").then(
      (result) => {
        console.log("OTP sent:", result.text);
      },
      (error) => {
        setError("Failed to send OTP");
        console.error("Error sending OTP:", error.text);
      }
    );
  };

  const openOtp = async () => {
    try {
      const generatedOtp = generateOtp();
      setSentOtp(generatedOtp); // Save OTP for later comparison
      sendOtpEmail(generatedOtp);
      setShowOtp(true);
      setError(null);
      setTimer(180); // Set timer for 3 minutes (180 seconds)
      alert("OTP Sent Successfully");
    } catch (error) {
      setError(error.message);
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOtp = async () => {
    if (otp === sentOtp.toString()) {
      setVerified(true);
      setShowOtp(false);
      alert("Email Verified Successfully!");
      setOtp(""); // Clear OTP input field
    } else {
      setError("Invalid OTP");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      setError("You must accept the Terms and Conditions.");
      return;
    }

    if (verified) {
      try {
        // Create the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userID = userType === "employer" ? await  generateEmpID(): await generateCandidateID();
          if (!userID) {
            console.error("Failed to generate job ID.");
            return;
          }

        // Initialize user data
        const userData = {
          userID:userID,
          name,
          email,
          phone,
          userType,
          companyName: userType === "employer" ? companyName : "",
          location,
          resume: userType === "candidate" && resume ? await uploadResume(resume,"resumes") : "",
          logo:  userType === "employer" && logo? await uploadResume(logo,"logos"):"",
          status: "pending",
        };

        // Store user data in database
        await set(ref(database, "users/" + user.uid), userData);
        const logoRef = ref(database, `logos`);
        const newLogoRef = push(logoRef);
        await update(newLogoRef,{logo : logo});
        console.log("User signed up:", user);
        navigate("/");
      } catch (error) {
        setError(error.message);
        console.error("Error signing up:", error);
      }
    } else {
      alert("Verify your Email Please!!!");
      setError("Email Not Verified");
    }
  };

  const uploadResume = async (file,path) => {
    try {
      const resumeRef = storageRef(storage, `${path}/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(resumeRef, file);
      const downloadURL = await getDownloadURL(resumeRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading resume: ", error);
      setError("Failed to upload resume.");
      return "";
    }
  };
  const handleUserType = (type) => {
    setUserType(type);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center ">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${background})` }}
      />
      <div
        className= {`relative  shadow-2xl p-8 rounded-2xl ring-1 ring-sky-700 w-full max-w-2xl my-10 transform transition duration-500 hover:scale-105 z-10 m-5 ${userType===""? "bg-gradient-to-tr from-sky-200 to-sky-600":"bg-sky-50"}`}
        style={{ backgroundImage: `url(${card_bg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Signup</h2>

        {/* User Type Selection - Gradient Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => handleUserType("candidate")}
            className={`px-4 py-2 rounded-lg font-bold  transition-all duration-300 transform hover:bg-sky-400 ${
              userType === "candidate"
                ? "bg-gradient-to-r from-sky-400 to-sky-600 scale-105 text-white"
                : "bg-white"
            }`}>
            Candidate
          </button>
          <button
            onClick={() => handleUserType("employer")}
            className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 transform hover:bg-sky-400 ${
              userType === "employer"
                ? "bg-gradient-to-r from-sky-400 to-sky-600 text-white scale-105"
                : "bg-white"
            }`}>
            Employer
          </button>
        </div>

        {/* Display Form Fields Based on Selection with Animation */}
        {userType && (
          <div className={`transition-opacity duration-700 ease-in ${userType ? "opacity-100" : "opacity-0"}`}>
            <form onSubmit={handleSignup} className="space-y-4 text-left">
              <div className="flex justify-between items-center">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-4/5 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-3/5 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
                <button
                  className="bg-blue-600 ring-2 bg-white/85 ring-blue text-sky-950 p-2 rounded-md hover:bg-sky-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                  onClick={openOtp}
                  type="button"
                  disabled={verified || timer > 0}>
                  {verified ? "Verified" : timer > 0 ? `Resend in ${timer}s` : "Verify"}
                </button>
              </div>
              {showOtp && (
                <div className="flex justify-between items-center">
                  <label className="block text-red-700">OTP</label>
                  <input
                    type="number"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-1 block w-4/5 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                  <button
                    className="bg-blue-600 ring-2 ring-red-700 text-sky-950 p-2 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    onClick={verifyOtp}
                    type="button">
                    Check
                  </button>
                </div>
              )}
              <div className="flex justify-between items-center">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-4/5 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-4/5 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              {/* Country, State, District Selection */}
              <div className="flex justify-between items-center">
                <label className="block text-gray-700">Country</label>
                <select value={location.country} onChange={handleCountryChange} className="mt-1 block w-4/5 p-2 border">
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              {location.country && (
                <div className="flex justify-between items-center">
                  <label className="block text-gray-700">State</label>
                  <select value={location.state} onChange={handleStateChange} className="mt-1 block w-4/5 p-2 border">
                    <option value="">Select State</option>
                    {Object.keys(stateObject[location.country]).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {location.state && (
                <div className="flex justify-between items-center">
                  <label className="block text-gray-700">District</label>
                  <select
                    value={location.district}
                    onChange={handleDistrictChange}
                    className="mt-1 block w-4/5 p-2 border">
                    <option value="">Select District</option>
                    {stateObject[location.country][location.state].map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {userType === "employer" && (
                <>
                  <div className="flex justify-between items-center">
                    <label className="block text-gray-700">Company Name</label>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="mt-1 block w-4/5 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  {/* <div className="flex justify-between items-center">
                    <label className="block text-gray-700">Location</label>
                    <input
                      type="text"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1 block w-4/5 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div> */}
               
                 <div className="flex justify-between items-center">
                 <label className="block text-gray-700">Company logo</label>
                 <input
                   type="file"
                   onChange={(e) => setLogo(e.target.files[0])}
                   className="mt-1 block w-4/5 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                   required
                 />
               </div>
                </>
              )}
              {userType === "candidate" && (
                <div className="flex justify-between items-center">
                  <label className="block text-gray-700">Resume</label>
                  <input
                    type="file"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="mt-1 block w-4/5 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
              )}
              <div className="flex justify-start space-x-3 items-center">
                <input
                  type="checkbox"
                  name="termsAndConditions"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                <label className="block text-gray-700">
                  I accept all the{" "}
                  <span className="font-bold underline italic cursor-pointer" onClick={() => setShowConditions(true)}>
                    Terms & Conditions
                  </span>
                </label>
              </div>
              <div className="items-center text-center">
                <button
                  type="submit"
                  className="bg-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ">
                  Signup
                </button>
              </div>
              <div className="flex flex-col justify-center items-center text-center">
                <p className="text-lg bg-white/60 rounded-full px-4 py-2 relative w-fit">
                  Already have an Account?
                  <Link to="/login" className="text-sky-600 underline ml-1">
                    Login
                  </Link>
                </p>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            </form>
          </div>
        )}
      </div>
      {showConditions && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full h-4/5 flex flex-col">
            {/* Terms and Conditions Component */}
            <div className="flex-grow overflow-y-auto">
              <TermsAndConditions className="h-full" />
            </div>

            {/* Modal Footer with Close Button */}
            <div className="mt-4 flex justify-end">
              <button
                className="px-3 py-1.5 font-bold rounded-lg bg-blue text-white hover:bg-blue-700 transition-all duration-300"
                onClick={() => setShowConditions(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
