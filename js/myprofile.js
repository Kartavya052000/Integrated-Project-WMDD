// FIREBASE //
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

  //global
  const firebaseConfig = {
    apiKey: "AIzaSyD2wZz5FE67IV7278ezzTiQfm0tP8Okmus",
    authDomain: "sportscrush-b20bd.firebaseapp.com",
    projectId: "sportscrush-b20bd",
    storageBucket: "sportscrush-b20bd.appspot.com",
    messagingSenderId: "188829017619",
    appId: "1:188829017619:web:f0bbbe5f64d432a2a3c1e6",
    measurementId: "G-9CS7TKRD9H"
  };



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
