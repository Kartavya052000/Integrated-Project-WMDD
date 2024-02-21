// FIREBASE //
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// My Query
const form = document.querySelector("form");
const dataHolder = {};
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(form);

  formData.forEach((value, key) => {
    dataHolder[key] = value;
  });
  console.log("Form Data:", dataHolder);
  //   writeUserData(dataHolder);
  form.reset();
});

let gd = document
  .getElementById("get-data-btn")
  .addEventListener("click", () => {
    let data = document.getElementById("get-data").value;
    console.log(dataHolder);
    getUserData(dataHolder);
  });

// Write user data

function writeUserData(dataHolder) {
  const db = getDatabase();
  set(ref(db, "users/" + dataHolder.phoneNumber), dataHolder)
    .then(() => {
      console.log("Data written successfully");
    })
    .catch((error) => {
      console.error("Error writing data: ", error);
    });
}
// Get User ID
function getUserData(dataHolder) {
  let userid = JSON.parse(localStorage.getItem("user"));
  console.log(userid.uid);
  return;

  console.log(dataHolder.phoneNumber);
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/6049064571`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        let rd = snapshot.val();
        console.log(rd);
        let address = document.getElementById("address");
        address.value = rd.address;
        let firstName = document.getElementById("firstName");
        firstName.value = rd.firstName;
        let lastName = document.getElementById("lastName");
        lastName.value = rd.lastName;
        let gender = document.getElementById("gender");
        gender.value = rd.gender;
        let dob = document.getElementById("dob");
        dob.value = rd.dob;
        let phoneNumber = document.getElementById("phoneNumber");
        phoneNumber.value = rd.phoneNumber;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
getUserData();
