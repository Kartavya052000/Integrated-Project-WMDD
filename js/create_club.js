var autocomplete;
let clubLocation;
function initAutocomplete() {
  console.log("Autocomplete initialized");
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("location"),
    { types: ["geocode"] }
  );
  autocomplete.addListener("place_changed", onPlaceChanged);
}

function onPlaceChanged() {
  var place = autocomplete.getPlace();
  console.log("Selected Place:", place);

  // Assuming your object is named 'locationObject'

  // Accessing the geometry object
  const geometry = place.geometry;

  // Accessing the location object within geometry
  const location = geometry.location;

  // Extracting latitude and longitude
  const latitude = location.lat(); // lat() function retrieves the latitude
  const longitude = location.lng(); // lng() function retrieves the longitude

  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);

  clubLocation = { Latitude: latitude, Longitude: longitude };
  //   console.log(clubLocation)
  // You can access various details of the selected place here and use them as needed.
  // For example, place.formatted_address, place.geometry.location.lat(), place.geometry.location.lng(), etc.
}

// Manual initialization after the script has loaded
document.addEventListener("DOMContentLoaded", function () {
    initAutocomplete();
  });

import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";

  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
  import {
    getDatabase,
    set,
  } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
  import {
    getFirestore,
    collection,
    addDoc,
  } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  // Initialize Realtime Database and get a reference to the service
  //   const database = getDatabase(app);

  const locationInput = document.getElementById("location");

  // locationInput.addEventListener("input", function () {
  //   const inputText = this.value;
  //   console.log("Input changed:", inputText);
  //   if (inputText.length >= 3) {
  //   }
  // });
  let autocompleteEnabled = true; // Flag to track whether autocomplete is enabled

  locationInput.addEventListener("input", function () {
    if (autocompleteEnabled) {
      const inputText = this.value;
      console.log("Input changed:", inputText);
      if (inputText.length >= 3) {
        // Perform autocomplete suggestions
      }
    }
  });
  locationInput.addEventListener("keydown", function () {
    autocompleteEnabled = false;
  });
  locationInput.addEventListener("blur", function () {
    autocompleteEnabled = true;
  });

  let data = {};
  var addressOfImage = "";

  document.getElementById("submit").addEventListener("click", (event) => {
    event.preventDefault();

    let uploadImageInput = document.getElementById("uploadImage");
    const file = uploadImageInput.files[0];
    if (file && file.type.startsWith("image/")) {
      var storage = getStorage();
      var storageRef = ref(storage, "images/" + file.name);
      const metadata = {
        contentType: "image/jpeg",
      };
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      console.log(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            addressOfImage = downloadURL;
            console.log("File available at", downloadURL, addressOfImage);
            submitForm();
          });
        }
      );
    } else {
      console.error("Invalid file type. Please select an image.");
    }
  });
  const submitForm = async () => {
    // Club type public or private
    let clubType;
    const publicClubBtn = document.getElementById("publicClub");
    const privateClubBtn = document.getElementById("privateClub");

    if (publicClubBtn.checked) {
      clubType = publicClubBtn.value;
    } else if (privateClubBtn.checked) {
      clubType = privateClubBtn.value;
    } else {
      alert("Please select a club type (public or private).");
      return;
    }

    // club details
    let clubName = document.getElementById("clubname").value;
    let sport = document.getElementById("sport").value;
    let clubDescription = document.getElementById("clubdescription").value;
    let clubImage = document.querySelector("#uploadImage").value;

    console.log(clubLocation);
    let clubDetails = {
      lat: clubLocation.Latitude,
      long: clubLocation.Longitude,
      address: locationInput.value,
      clubType: clubType,
    };
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user.uid, "USERRRRR");
    data = {
      clubName: clubName,
      Sport: sport,
      clubDescription: clubDescription,
      image: clubImage,
      addressOfImage: addressOfImage,
      // "location":locationInput.value,
      clubDetails: clubDetails,
      admin_id: user.uid,
      club_requests: {
        pending_requests: [],
        approved_requests: [],
        declined_requests: [],
      },

      // Add other fields if needed
    };
    console.log(data);

    try {
      console.log(data);
      // Get a reference to the "clubs" collection
      const clubsCollectionRef = collection(db, "clubs");

      // Add club document to "clubs" collection

      const clubDocRef = await addDoc(clubsCollectionRef, {
        clubName: clubName,
        Sport: sport,
        clubDescription: clubDescription,
        addressOfImage: addressOfImage,
        // "location":locationInput.value,
        clubDetails: clubDetails,
        admin_id: user.uid,
      });
      alert("Club Store Successfully Added");
      console.log("Club created successfully with ID: ", clubDocRef.id);
    } catch (error) {
      console.error("Error creating club: ", error);
      alert(error);
    }
  };
