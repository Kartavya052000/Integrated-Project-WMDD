import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

//global
const firebaseConfig = {
  apiKey: "AIzaSyD2wZz5FE67IV7278ezzTiQfm0tP8Okmus",
  authDomain: "sportscrush-b20bd.firebaseapp.com",
  projectId: "sportscrush-b20bd",
  storageBucket: "sportscrush-b20bd.appspot.com",
  messagingSenderId: "188829017619",
  appId: "1:188829017619:web:f0bbbe5f64d432a2a3c1e6",
  measurementId: "G-9CS7TKRD9H",
};

const app = initializeApp(firebaseConfig);

// My Query
const db = getFirestore(app);
let autocomplete;
let clubLocation;

function initAutocomplete() {
  console.log("Autocomplete initialized");
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("address"),
    { types: ["geocode"] }
  );
  autocomplete.addListener("place_changed", onPlaceChanged);
}

function onPlaceChanged() {
  var place = autocomplete.getPlace();
  console.log("Selected Place:", place);

  const geometry = place.geometry;
  const location = geometry.location;
  const latitude = location.lat();
  const longitude = location.lng();

  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);

  clubLocation = { Latitude: latitude, Longitude: longitude };
}

document.addEventListener("DOMContentLoaded", function () {
  initAutocomplete();
});
let user = JSON.parse(localStorage.getItem("user"));
const userCollection = collection(getFirestore(), "users"); // Note: Invoke getFirestore()
const userDocRef = doc(userCollection, user.uid);
getDoc(userDocRef)
  .then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();

      // Split displayName into first name and last name
      const displayName = userData.displayName || "";
      const names = displayName.split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ") || "";
      document.getElementById("displayName").value = firstName;
      document.getElementById("lastName").value = lastName;
      // document.getElementById("displayName").value =
      //   userData.displayName == undefined ? "" : userData.displayName;
      // document.getElementById("lastName").value =
      //   userData.lastName == undefined ? "" : userData.lastName;
      document.getElementById("gender").value =
        userData.gender == undefined ? "" : userData.gender;
      document.getElementById("dob").value =
        userData.dob == undefined ? "" : userData.dob;
      document.getElementById("phoneNumber").value =
        userData.phoneNumber == undefined ? "" : userData.phoneNumber;
      document.getElementById("email").value =
        userData.email == undefined ? "" : userData.email;
      //document.getElementById("address").value = userData.address==undefined?'':userData.address;
      document.getElementById("sportsInterest").value =
        userData.sportsInterest == undefined ? "" : userData.sportsInterest;
      document.getElementById("address").value =
        userData.address == undefined ? "" : userData.address;
      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("address")
      );
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
  var place = autocomplete.getPlace();
  console.log("Place inside:", place);

  console.log(document.getElementById("address").value);
  // Data shown in firebase
  let editedData = {
    displayName: document.getElementById("displayName").value,
    lastName: document.getElementById("lastName").value,
    gender: document.getElementById("gender").value,
    dob: document.getElementById("dob").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
    sportsInterest: document.getElementById("sportsInterest").value,
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
    await setDoc(doc(db, "users", user.uid), data);
    console.log("data added successfully");
  } catch (err) {
    console.log(err);
  }
};
//
window.addEventListener("load", (event) => {
  document
    .getElementById("editButton")
    .addEventListener("click", function (event) {
      const fields = document.querySelectorAll(
        'input[type="text"], input[type="date"], input[type="tel"],input[type="email"]'
      );
      const editButton = document.getElementById("editButton");

      if (editButton.textContent === "Edit") {
        // Enable editing
        fields.forEach((field) => {
          if (field.id != "email") {
            field.removeAttribute("readonly");
          }
        });
        editButton.textContent = "Save";
      } else {
        console.log;
        // Save changes
        const editedData = {
          displayName: document.getElementById("displayName").value,
          lastName: document.getElementById("lastName").value,
          gender: document.getElementById("gender").value,
          dob: document.getElementById("dob").value,
          phoneNumber: document.getElementById("phoneNumber").value,
          email: document.getElementById("email").value,
          address: document.getElementById("address").value,
          sportsInterest: document.getElementById("sportsInterest").value,
        };
        setData(editedData); // Define this function to update user data
        // Disable editing
        fields.forEach((field) => {
          if (field) field.setAttribute("readonly", true);
        });
        editButton.textContent = "Edit";
        console.log(editButton.textContent);
      }
    });
  let username = (document.querySelector(
    ".username"
  ).innerHTML = `<h4>Email Id </h4>${user.email}`);
});
