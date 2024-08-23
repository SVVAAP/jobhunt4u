import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import background from "../assets/signin_bg.png"
import card_bg from "../assets/login_card2.png"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user);
      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error("Error logging in:", error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset password.");
      return;
    }
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent!');
    } catch (error) {
      setError(error.message);
      console.error("Error sending password reset email:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center "  style={{ backgroundImage: `url(${background})` }}>
      <div className="bg-white p-8 rounded shadow-md m-5 w-full max-w-4xl transform transition duration-500 hover:scale-105 flex items-center"  style={{ backgroundImage: `url(${card_bg})`, backgroundPosition: "center" , backgroundSize: "cover"}}>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200">Login</button>
              <button type="button" onClick={handleForgotPassword} className="text-sm text-blue-500 hover:underline focus:outline-none">Forgot Password?</button>
            </div>
            <p className='text-lg bg-white/60 rounded relative w-fit p-3 '>Create a New Account? <Link to="/signup" className='text-sky-600 underline'>Signin</Link></p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
        <div className="hidden md:block w-1/2">
          <img src="https://static.vecteezy.com/system/resources/previews/010/872/229/original/3d-job-applicant-illustration-png.png" alt="Login Illustration" className="h-full w-full object-cover rounded-r-md" />
        </div>
      </div>
    </div>
  );
};

export default Login;
