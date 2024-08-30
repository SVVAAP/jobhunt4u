import React, { useEffect, useState } from "react";
import { auth, database, getDownloadURL, storage, ref as storageRef, uploadBytes } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com"; // Import EmailJS
import background from "../assets/signin_bg.png";
import card_bg from "../assets/sign_card.png";
import TermsAndConditions from "./TermsAndConditions";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("candidate");
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [resume, setResume] = useState(null);
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [verified, setVerified] = useState(false);
  const [location, setLocation] = useState("");
  const [showConditions, setShowConditions] = useState(false); 
  const [termsAccepted, setTermsAccepted] = useState(false); // State to check Terms acceptance
  const [timer, setTimer] = useState(0); // State to keep track of timer
  
  const navigate = useNavigate();

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

    emailjs.send("service_w9shb6j", "template_9b9fk37", templateParams, "MZ-qy3k1Y1ct2suVP").then(
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

        // Initialize user data
        const userData = {
          name,
          email,
          phone,
          userType,
          companyName: userType === "employer" ? companyName : "",
          location: userType === "employer" ? location : "",
          resume: userType === "candidate" && resume ? await uploadResume(resume) : "",
        };

        // Store user data in database
        await set(ref(database, "users/" + user.uid), userData);

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

  const uploadResume = async (file) => {
    try {
      const resumeRef = storageRef(storage, `resumes/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(resumeRef, file);
      const downloadURL = await getDownloadURL(resumeRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading resume: ", error);
      setError("Failed to upload resume.");
      return "";
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${background})` }}
      />
      <div
        className="relative bg-sky-50 shadow-2xl p-8 rounded-lg ring-1 ring-sky-700 w-full max-w-2xl transform transition duration-500 hover:scale-105 z-10 m-5"
        style={{ backgroundImage: `url(${card_bg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Signup</h2>
        <form onSubmit={handleSignup} className="space-y-4 text-center">
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
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-4/5 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex justify-between items-center ">
            <label className="block text-gray-700">I am a</label>
            <div className="mt-1 flex space-x-4">
              <label className="inline-flex w-4/5 items-center">
                <input
                  type="radio"
                  value="candidate"
                  checked={userType === "candidate"}
                  onChange={(e) => setUserType(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-2">Candidate</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="employer"
                  checked={userType === "employer"}
                  onChange={(e) => setUserType(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-2">Employer</span>
              </label>
            </div>
          </div>
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
              <div className="flex justify-between items-center">
                <label className="block text-gray-700">Location</label>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
              <span
                className="font-bold underline italic cursor-pointer"
                onClick={() => setShowConditions(true)}
              >
                Terms & Conditions
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200">
            Signup
          </button>
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
      {showConditions && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
            <TermsAndConditions />
            <div className="mt-4 flex justify-between">
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
