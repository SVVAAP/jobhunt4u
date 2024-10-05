const admin = require('../config/firebaseAdmin'); // Import Firebase Admin SDK

// Function to delete a user by uid
const deleteUser = async (req, res) => {
  const { uid } = req.params;

  try {
    // Try to get the user from Firebase Authentication
    const userRecord = await admin.auth().getUser(uid);
    if (!userRecord) {
      // If user doesn't exist in Firebase Auth, just delete their data from Realtime Database
      console.log(`User with UID ${uid} does not exist in Firebase Authentication.`);
    } else {
      // If user exists, delete from Firebase Authentication
      await admin.auth().deleteUser(uid);
      console.log(`Successfully deleted user: ${uid}`);
    }

    // Delete user data from Firebase Realtime Database
    await admin.database().ref(`users/${uid}`).remove();
    console.log(`Successfully deleted user data from Realtime Database: ${uid}`);

    res.status(200).send({ message: 'User deleted successfully.' });
  } catch (error) {
    // Handle specific error when user is not found in Firebase Auth
    if (error.code === 'auth/user-not-found') {
      // User does not exist in Firebase Authentication, proceed with deleting their data
      console.log(`User with UID ${uid} not found in Firebase Authentication. Proceeding to delete data from Realtime Database.`);

      // Delete user data from Firebase Realtime Database
      try {
        await admin.database().ref(`users/${uid}`).remove();
        console.log(`Successfully deleted user data from Realtime Database: ${uid}`);

        res.status(200).send({ message: 'User data deleted successfully from Realtime Database.' });
      } catch (dbError) {
        console.error('Error deleting user data from Realtime Database:', dbError);
        res.status(500).send({ error: 'Failed to delete user data from Realtime Database.' });
      }
    } else {
      console.error('Error deleting user:', error);
      res.status(500).send({ error: 'Failed to delete user.' });
    }
  }
};

module.exports = {
  deleteUser,
};
