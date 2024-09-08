// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('../config/firebaseAdmin'); // Correct path to Firebase Admin setup

router.delete('/deleteUser/:uid', async (req, res) => {
  const { uid } = req.params;
  console.log(`Attempting to delete user with UID: ${uid}`); // Debugging log
  try {
    // Delete user from Firebase Authentication
    await admin.auth().deleteUser(uid);
    console.log(`Successfully deleted user from Firebase Auth: ${uid}`);

    // Optionally, delete user data from Firestore or Realtime Database
    await admin.database().ref(`users/${uid}`).remove();
    console.log(`Successfully deleted user data from Realtime Database: ${uid}`);

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error); // Improved error logging
    res.status(500).json({ error: error.message });
  }
});
router.get("/", async (req, res) => {
    try {
      console.log("Attempt to get in");  // Log the attempt
      // You can add more logic here if needed, like processing the request body
  
      res.status(200).json({ message: "Connected to Backend" });  // Respond with a success message
    } catch (error) {
      console.error("Error handling POST request:", error);
      res.status(500).json({ message: "Server error" });  // Handle any potential errors
    }
  });
router.get("/", async (req, res) => {
    try {
      console.log("Attempt to get in");  // Log the attempt
      // You can add more logic here if needed, like processing the request body
  
      res.status(200).json({ message: "Connected to Backend" });  // Respond with a success message
    } catch (error) {
      console.error("Error handling POST request:", error);
      res.status(500).json({ message: "Server error" });  // Handle any potential errors
    }
  });

router.get("/", async (req, res) => {
  try {
    console.log("Attempt to get in");  // Log the attempt
    // You can add more logic here if needed, like processing the request body

    res.status(200).json({ message: "Connected to Backend" });  // Respond with a success message
  } catch (error) {
    console.error("Error handling POST request:", error);
    res.status(500).json({ message: "Server error" });  // Handle any potential errors
  }
});


module.exports = router;
