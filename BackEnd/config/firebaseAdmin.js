// backend/config/firebaseAdmin.js
const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json"); // Ensure this path is correct
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

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
