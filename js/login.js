import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"; // Import Firestore functions

// global
const firebaseConfig = {
  apiKey: "AIzaSyD2wZz5FE67IV7278ezzTiQfm0tP8Okmus",
  authDomain: "sportscrush-b20bd.firebaseapp.com",
  projectId: "sportscrush-b20bd",
  storageBucket: "sportscrush-b20bd.appspot.com",
  messagingSenderId: "188829017619",
  appId: "1:188829017619:web:f0bbbe5f64d432a2a3c1e6",
  measurementId: "G-9CS7TKRD9H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let auth = getAuth();
let database = getDatabase(app);
let provider = new GoogleAuthProvider(app);
let firestore = getFirestore();

// SignUp
// document.getElementById("signUp").addEventListener("click", function () {
//   var email = document.getElementById("email").value;
//   var password = document.getElementById("password").value;
//   var username = document.getElementById("username").value;

//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       localStorage.setItem("user", JSON.stringify(user));
//       // Save user information in Firestore collection'
//       var sportsSelect = document.getElementById("sports").value;
//       const userInfo = {
//         uid: user.uid,
//         email: user.email,
//         username:username,
//         sports_interest: sportsSelect,
//         club_requests: {
//           pending_requests: [],
//           approved_requests: [],
//           declined_requests: [],
//         },
//         // Add other user information as needed
//       };
// console.log(userInfo,"usr")
// // return
//       // Firestore collection reference
//       const usersCollection = collection(firestore, "users");

//       // Add user document to the collection
//       setDoc(doc(usersCollection, user.uid), userInfo)
//         .then(() => {
//           console.log("User information saved successfully");
//       alert("User created!");
//       window.location.href = `./index.html`;

//         })
//         .catch((error) => {
//           console.error("Error saving user information:", error);
//         });
//     })
//     .catch((error) => {
//       console.error("Error creating user:", error);
//       alert(error.code, error.message);
//     });
// });

// Login
document.getElementById("login").addEventListener("click", function () {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  //remove required attribute from interests
  // var sportsSelect = document.getElementById("sports");
  // sportsSelect.removeAttribute("required");
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("login", user);
      alert("Success Login!");
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = `./index.html`;
    })
    .catch((error) => {
      alert(error.code, error.message);
    });
});

// GoogleSignIn
// document.getElementById("googleSignIn").addEventListener("click", function () {
//   signInWithPopup(auth, provider)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       console.log(user);
//       localStorage.setItem("user", JSON.stringify(user));

//       const userInfo = {
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,

//         // Add other user information as needed
//       };

//       // Firestore collection reference
//       const usersCollection = collection(firestore, "users");

//       setDoc(doc(usersCollection, user.uid), userInfo)
//         .then(() => {
//           alert("Welcome, " + user.displayName);
//         })
//         .catch((error) => {
//           alert("Error saving user information: " + error.message);
//         });
//     })
//     .catch((error) => {
//       console.error("Google sign-in error:", error);
//       alert("Google sign-in error: " + error.message);
//     });
// });

// Sign-out
// document.getElementById("logout").addEventListener("click", function () {
//   signOut(auth)
//     .then(() => {
//       localStorage.removeItem("user");
//       alert("logout");
//       window.location.reload();
//     })
//     .catch((error) => {
//       alert("logout error:", error);
//     });
// });

const user = JSON.parse(localStorage.getItem("user"));
// if (user) {
//   document.getElementById("loginContainer").style.display = "none";
//   document.getElementById("userDetailsWrapper").style.display = "block";

//   const userDetails = document.getElementById("userDetails");
//   userDetails.innerHTML = `
//                     <div style="text-align:center">
//                         <h2>User:${user.email}</h2>
//                     `;
// } else {
//   document.getElementById("loginContainer").style.display = "block";
//   document.getElementById("userDetailsWrapper").style.display = "none";
// }


// for hide show password
// const passwordField = document.getElementById("password");
// const togglePassword = document.querySelector(".password-toggle-icon i");

// togglePassword.addEventListener("click", function () {
//   if (passwordField.type === "password") {
//     passwordField.type = "text";
//     togglePassword.classList.remove("fa-eye");
//     togglePassword.classList.add("fa-eye-slash");
//   } else {
//     passwordField.type = "password";
//     togglePassword.classList.remove("fa-eye-slash");
//     togglePassword.classList.add("fa-eye");
//   }
// });
