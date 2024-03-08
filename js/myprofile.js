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
let user = JSON.parse(localStorage.getItem("user"));
const userCollection = collection(getFirestore(), "users"); // Note: Invoke getFirestore()
const userDocRef = doc(userCollection, user.uid);
document.addEventListener("DOMContentLoaded", function () {
  initAutocomplete();
  getDoc(userDocRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        // Populate form fields with user data
        document.getElementById("firstName").value = userData.firstName || "";
        document.getElementById("lastName").value = userData.lastName || "";
        document.getElementById("gender").value = userData.gender || "";
        document.getElementById("dob").value = userData.dob || "";
        document.getElementById("phoneNumber").value =
          userData.phoneNumber || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("sportsInterest").value =
          userData.sports_interest || "";
        console.log(userData.sports_interest);
        // Populate address input with location if available
        if (userData.address) {
          document.getElementById("address").value = userData.address;
        }
      } else {
        console.log("No such Document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  // getDoc(userDocRef)
  // .then((docSnapshot) => {
  //   if (docSnapshot.exists()) {
  //     const userData = docSnapshot.data();

  //     document.getElementById("lastName").value = userData.lastName==undefined?'':userData.lastName;
  //     document.getElementById("gender").value = userData.gender==undefined?'':userData.gender;
  //     document.getElementById("dob").value = userData.dob==undefined?'':userData.dob;
  //     document.getElementById("phoneNumber").value = userData.phoneNumber==undefined?'':userData.phoneNumber;
  //     document.getElementById("email").value = userData.email==undefined?'':userData.email;
  //     //document.getElementById("address").value = userData.address==undefined?'':userData.address;
  //     document.getElementById("sportsInterest").value =userData.sports_interest==undefined?'':userData.sports_interest;
  //     const autocomplete = new google.maps.places.Autocomplete(document.getElementById("address"));
  //   } else {
  //     console.log("No such Document!");
  //   }
  // })
  // .catch((error) => {
  //   console.log("Error getting document:", error);
  // });
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
    sports_interest: document.getElementById("sportsInterest").value,
  };
  console.log(editedData);
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
// Check if user has allowed location permission
function checkLocationPermission() {
  if ("geolocation" in navigator) {
    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (result) {
        if (result.state === "granted") {
          // Permission granted, fetch user's location and fill in the profile
          getCurrentLocation();
        } else if (result.state === "prompt") {
          // Prompt the user to allow location access
          alert(
            "Please allow access to your location to fill in your profile."
          );
        } else if (result.state === "denied") {
          // Permission denied, show message asking user to allow access
          alert(
            "Please allow access to your location in order to fill in your profile."
          );
        }
        result.onchange = function () {
          console.log("Permission state changed to", this.state);
        };
      });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Fetch user's current location
function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Fill in the profile with the user's location
      fillLocation(latitude, longitude);
    },
    function (error) {
      console.error("Error getting user's location:", error);
    }
  );
}

// Fill in the profile with the user's location
function fillLocation(latitude, longitude) {
  // Use latitude and longitude to populate the address input or any other fields in the profile
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDpN1dFF_d3RhD-ndBd3dGpapZqFAPS7O0`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        const address = data.results[0].formatted_address;
        document.getElementById("address").value = address;
      } else {
        console.error("Failed to fetch address:", data.status);
      }
    })
    .catch((error) => {
      console.error("Error fetching address:", error);
    });
}

// Call checkLocationPermission when DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  checkLocationPermission();
});
