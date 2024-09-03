// src/components/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../firebase';
import { ref, onValue } from "firebase/database";
import Navbar from './Navbar';

const PrivateRoute = ({ element: Component }) => {
  const [user, loading] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmployer, setIsEmployer] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const userRef = ref(database, `users/${user.uid}`); // Adjust path as per your database structure
    const unsubscribe = onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.userType === "admin") {
        setIsEmployer(true);
      } else {
        setError("You are not authorized to access this page.");
        <login/>
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading || isLoading) {
    return <div className='flex justify-center'>Loading...</div>;
  }

  if (error) {
    return < >
      <Navbar/>
      <div className='flex-row-reverse text-center justify-center mt-10 font-bold text-2xl text-red-500'>
     <span className='mt-10'>{error}</span></div> </>;
  }

  return user ? <Component isEmployer={isEmployer} /> : <Navigate to="/login-admin" />;
};

export default PrivateRoute;
