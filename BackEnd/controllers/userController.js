// backend/controllers/userController.js

const admin = require('../config/firebaseAdmin'); // Import Firebase Admin SDK

// Function to delete a user by uid
const deleteUser = async (req, res) => {
  const { uid } = req.params;

  try {
    // Delete user from Firebase Authentication
    await admin.auth().deleteUser(uid);
    console.log(`Successfully deleted user: ${uid}`);

    // Delete user data from Firebase Realtime Database
    await admin.database().ref(`users/${uid}`).remove();
    console.log(`Successfully deleted user data from Realtime Database: ${uid}`);

    res.status(200).send({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ error: 'Failed to delete user.' });
  }
};

module.exports = {
  deleteUser,
};
