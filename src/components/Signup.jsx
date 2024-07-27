import React, { useState } from "react";
import { auth, database, getDownloadURL, storage, ref as storageRef, uploadBytes } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com"; // Import EmailJS
import background from "../assets/signin_bg.png";
import card_bg from "../assets/sign_card.png";

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
  const navigate = useNavigate();

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  };

  const sendOtpEmail = (otp_code) => {
    const templateParams = {
      to_name: name,
      otp: otp_code,
      to_email:email
    };

    emailjs.send("service_6iar33a", "template_be150gv", templateParams, "nq0XIkYT4cuoYUKQI").then(
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
      setError("Invalid OTP");
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
    <div style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400">
        <div
          className="bg-sky-50 shadow-2xl p-8 rounded-3xl ring-1 ring-sky-700 w-full max-w-2xl transform transition duration-500 hover:scale-105"
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
                className="bg-blue-600 ring-2 ring-blue text-sky-950 p-2 rounded-md hover:bg-sky-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                onClick={openOtp}
                type="button"
                disabled={verified}>
                {verified ? "Verified" : "Verify"}
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
                  onClick={() => {
                    verifyOtp();
                  }}
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
            <div className="flex justify-around items-center">
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
                    className="form-radio ms-11"
                  />
                  <span className="ml-2">Employer</span>
                </label>
              </div>
            </div>
            {userType === "employer" ? (
              <div>
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
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <label className="block text-gray-700">Upload Resume</label>
                <input
                  type="file"
                  name="resume"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="mt-1 block w-4/5 p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-1/3 bg-blue-600 ring-2 ring-blue text-sky-950 p-2 rounded-md hover:bg-sky-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
              disabled={!verified}>
              Signup
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
