// src/components/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../firebase';
import { ref, onValue } from "firebase/database";

const PrivateRoute = ({ element: Component }) => {
  const [user, loading] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmployer, setIsEmployer] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const userRef = ref(database, `users/${user.uid}`); // Adjust path as per your database structure
    const unsubscribe = onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      setIsEmployer(userData && userData.userType === "admin");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading || isLoading) {
    return <div className='flex justify-center'>Loading...</div>;
  }

  return user ? <Component isEmployer={isEmployer} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
