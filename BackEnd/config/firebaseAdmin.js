// backend/config/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey"); // Ensure this path is correct

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://jobhunt4u-d6761-default-rtdb.firebaseio.com", // Replace with your Firebase DB URL
  });
  console.log("Firebase Admin initialized successfully.");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

module.exports = admin;
