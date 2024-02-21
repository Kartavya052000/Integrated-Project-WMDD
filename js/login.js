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
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"; // Import Firestore functions

    // Your web app's Firebase configuration
    // const firebaseConfig = {
    //   apiKey: "AIzaSyAGLcybmjB3QBZ5Bdk02nIkqb0F3pJKf1E",
    //   authDomain: "fir-sports-93164.firebaseapp.com",
    //   databaseURL: "https://fir-sports-93164-default-rtdb.firebaseio.com",
    //   projectId: "fir-sports-93164",
    //   storageBucket: "fir-sports-93164.appspot.com",
    //   messagingSenderId: "48172665362",
    //   appId: "1:48172665362:web:1a401f43ed83b3faaba6cb"
    // };

    //KARTAVYA CREDS
    const firebaseConfig = {
    apiKey: "AIzaSyC3L-pygyvZqYOGp5Os7swV54Mhno1To88",
    authDomain: "test-8e125.firebaseapp.com",
    databaseURL: "https://test-8e125-default-rtdb.firebaseio.com",
    projectId: "test-8e125",
    storageBucket: "test-8e125.appspot.com",
    messagingSenderId: "675271753145",
    appId: "1:675271753145:web:0f2070f6b149b210608a68",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// //

// const firebaseConfig = {
//   apiKey: "AIzaSyC3L-pygyvZqYOGp5Os7swV54Mhno1To88",
//   authDomain: "test-8e125.firebaseapp.com",
//   databaseURL: "https://test-8e125-default-rtdb.firebaseio.com",
//   projectId: "test-8e125",
//   storageBucket: "test-8e125.appspot.com",
//   messagingSenderId: "675271753145",
//   appId: "1:675271753145:web:0f2070f6b149b210608a68",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let auth = getAuth();
let database = getDatabase(app);
let provider = new GoogleAuthProvider(app);
let firestore = getFirestore();
// SignUp
document.getElementById("signUp").addEventListener("click", function () {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("signup", user);
      alert("User created!");

      // Save user information in Firestore collection
      const userInfo = {
        uid: user.uid,
        email: user.email,
        club_requests: {
          pending_requests: [],
          approved_requests: [],
          declined_requests: [],
        },
        // Add other user information as needed
      };

      // Firestore collection reference
      const usersCollection = collection(firestore, "users");

      // Add user document to the collection
      setDoc(doc(usersCollection, user.uid), userInfo)
        .then(() => {
          console.log("User information saved successfully");
        })
        .catch((error) => {
          console.error("Error saving user information:", error);
        });
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      alert(error.code, error.message);
    });
});

// Login
document.getElementById("login").addEventListener("click", function () {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  console.log(email, password);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("login", user);
      alert("Success Login!");
      localStorage.setItem("user", JSON.stringify(user));
    })
    .catch((error) => {
      alert(error.code, error.message);
    });
});
// // SignUp
// document.getElementById("signUp").addEventListener("click", function () {
//   var email = document.getElementById("email").value;
//   var password = document.getElementById("password").value;

//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       console.log("signup", user);
//       alert("User created!");

//       // Save user information in Firestore collection
//       const userInfo = {
//         uid: user.uid,
//         email: user.email,
//         club_requests: {
//           pending_requests: [],
//           approved_requests: [],
//           declined_requests: [],
//         },
//         // Add other user information as needed
//       };

//       // Firestore collection reference
//       const usersCollection = collection(firestore, "users");

//       // Add user document to the collection
//       setDoc(doc(usersCollection, user.uid), userInfo)
//         .then(() => {
//           console.log("User information saved successfully");
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

//
// GoogleSignIn
// GoogleSignIn
document.getElementById("googleSignIn").addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((userCredential) => {
      const user = userCredential.user;

      const userInfo = {
        uid: user.uid,
        email: user.email,
        // Add other user information as needed
      };

      // Firestore collection reference
      const usersCollection = collection(firestore, "users");

      setDoc(doc(usersCollection, user.uid), userInfo)
        .then(() => {
          console.log("User information saved successfully");
          alert("User information saved successfully");
        })
        .catch((error) => {
          console.error("Error saving user information:", error);
          alert("Error saving user information: " + error.message);
        });
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
      alert("Google sign-in error: " + error.message);
    });
});
