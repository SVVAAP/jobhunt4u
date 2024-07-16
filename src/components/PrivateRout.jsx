// src/components/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../firebase';
import { ref, onValue } from "firebase/database";
import login from "./login";

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
    return <div className='flex justify-center text-red-500'>{error}</div>;
  }

  return user ? <Component isEmployer={isEmployer} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
