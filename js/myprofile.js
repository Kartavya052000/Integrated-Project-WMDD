import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

// // ARUN'S Firebase CDN //
const firebaseConfig = {
  apiKey: "AIzaSyD0815flbjkOuw-q3yvqwAhC3th2Ot6bKU",
  authDomain: "sportscrush-a2c22.firebaseapp.com",
  databaseURL: "https://sportscrush-a2c22-default-rtdb.firebaseio.com/",
  projectId: "sportscrush-a2c22",
  storageBucket: "sportscrush-a2c22.appspot.com",
  messagingSenderId: "207698821549",
  appId: "1:207698821549:web:603d14dd42309de0e4e124",
  measurementId: "G-Q57DD6FLFZ",
};

// Common Firebase
// // const firebaseConfig = {
//   apiKey: "AIzaSyC3L-pygyvZqYOGp5Os7swV54Mhno1To88",
//   authDomain: "test-8e125.firebaseapp.com",
//   databaseURL: "https://test-8e125-default-rtdb.firebaseio.com",
//   projectId: "test-8e125",
//   storageBucket: "test-8e125.appspot.com",
//   messagingSenderId: "675271753145",
//   appId: "1:675271753145:web:0f2070f6b149b210608a68",
// };

const app = initializeApp(firebaseConfig);

// My Query
const db = getFirestore(app);

let user = JSON.parse(localStorage.getItem("user"));
const userCollection = collection(getFirestore(), "users"); // Note: Invoke getFirestore()
const userDocRef = doc(userCollection, user.email);
console.log(userDocRef);
getDoc(userDocRef)
  .then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      document.getElementById("firstName").value = userData.firstName;
      document.getElementById("lastName").value = userData.lastName;
      document.getElementById("gender").value = userData.gender;
      document.getElementById("dob").value = userData.dob;
      document.getElementById("phoneNumber").value = userData.phoneNumber;
      document.getElementById("email").value = userData.email;
      document.getElementById("address").value = userData.address;
    } else {
      console.log("No such Document!");
    }
  })
  .catch((error) => {
    console.log("Error getting document:", error);
  });
window.addEventListener("load", (event) => {
  let username = (document.querySelector(".username").innerHTML = user.email);
});

// onload = (event) => {};
document.querySelector("#form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  // Capture edited data from form fields
  let editedData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    gender: document.getElementById("gender").value,
    dob: document.getElementById("dob").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
  };
  //creating data
  setData(editedData);
  // Update user document in Firestore
  updateDoc(userDocRef, editedData)
    .then(() => {
      console.log("Document successfully updated!");
      // You can provide a success message to the user or redirect them to another page
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
      // Handle error scenario
    });
});
const setData = async (data) => {
  try {
    await setDoc(doc(db, "users", user.email), data);
    console.log("data added fuckfessfully");
  } catch (err) {
    console.log(err);
  }
};
