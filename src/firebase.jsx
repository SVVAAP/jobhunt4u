// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA67lTh7c3SFwv7VOoZVo84TiBLC4VSzfY",
  authDomain: "jobhunt4u-d6761.firebaseapp.com",
  databaseURL: "https://jobhunt4u-d6761-default-rtdb.firebaseio.com",
  projectId: "jobhunt4u-d6761",
  storageBucket: "jobhunt4u-d6761.appspot.com",
  messagingSenderId: "965268790775",
  appId: "1:965268790775:web:14ba735640498c534ae2f2",
  measurementId: "G-Q9QZVBMRXH"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
