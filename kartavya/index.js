import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyC3L-pygyvZqYOGp5Os7swV54Mhno1To88",
    authDomain: "test-8e125.firebaseapp.com",
    projectId: "test-8e125",
    storageBucket: "test-8e125.appspot.com",
    messagingSenderId: "675271753145",
    appId: "1:675271753145:web:0f2070f6b149b210608a68"
  };

  // Initialize Firebase
//   const firebase = initializeApp(firebaseConfig);
//   const auth= firebase.auth()
//   const db = firebase.database()
// firebase.initializeApp(firebaseConfig);


//   //register functionfunction register() {
//             var email = "test@gmail.com";
//             var password = "Test@123";
//             firebase.auth().createUserWithEmailAndPassword(email, password)
//                 .then((userCredential) => {
//                     var user = userCredential.user;
//                     console.log("User registered:", user.uid);
//                     // Add user data to Firebase Database
//                     var user_data = {
//                         email: email,
//                         password: password
//                     };
//                     firebase.database().ref("users/" + user.uid).set(user_data)
//                         .then(() => {
//                             console.log("User data added to database");
//                         })
//                         .catch((error) => {
//                             console.error("Error adding user data to database:", error);
//                         });
//                 })
//                 .catch((error) => {
//                     console.error("Error creating user:", error);
//                 });
        

//         register();
// Get elements
const app = initializeApp(firebaseConfig);

// Get the Auth instance
const auth = getAuth(app);

// Example usage: Sign in with email and password
const email = "user@example.com";
const password = "password123";

signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        console.log("User signed in:", user.uid);
    })
    .catch((error) => {
        // Handle errors
        console.error("Error:", error.message);
    });