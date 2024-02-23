import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyC3L-pygyvZqYOGp5Os7swV54Mhno1To88",
//   authDomain: "test-8e125.firebaseapp.com",
//   databaseURL: "https://test-8e125-default-rtdb.firebaseio.com",
//   projectId: "test-8e125",
//   storageBucket: "test-8e125.appspot.com",
//   messagingSenderId: "675271753145",
//   appId: "1:675271753145:web:0f2070f6b149b210608a68",
// };
// Davinder Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAAKBahfdbR25SHn1F2IDejzjpd2mC8R5g",
  authDomain: "new-sports-8df77.firebaseapp.com",
  projectId: "new-sports-8df77",
  storageBucket: "new-sports-8df77.appspot.com",
  messagingSenderId: "1053444109448",
  appId: "1:1053444109448:web:dc8693364d3128a2e75b3d",
};

// const firebaseConfig = {
//     apiKey: "AIzaSyC3L-pygyvZqYOGp5Os7swV54Mhno1To88",
//     authDomain: "test-8e125.firebaseapp.com",
//     databaseURL: "https://test-8e125-default-rtdb.firebaseio.com",
//     projectId: "test-8e125",
//     storageBucket: "test-8e125.appspot.com",
//     messagingSenderId: "675271753145",
//     appId: "1:675271753145:web:0f2070f6b149b210608a68",
// };

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
// Initialize Firebase authentication
const auth = getAuth();

// global
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
// var autocomplete;
// let eventLocation;

// fetch the clubs
function fetchClubDetails() {
  if (id) {
    const clubDocRef = doc(firestore, "clubs", id);
    getDoc(clubDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const clubData = docSnapshot.data();
          console.log(clubData);
          const clubDetails = document.getElementById("clubDetails");
          clubDetails.innerHTML = `
                    <div style="text-align:center">
                        <h2>Club Name:${clubData.clubName}</h2>
                        <img src=${clubData?.addressOfImage} alt="${clubData.title}" style="width: 50%;height:50%" >
                        <p> Club Description: ${clubData.clubDescription}</p>
                        <p>Club Address: ${clubData.clubDetails.address}</p>
                        <p>Club Category: ${clubData.Sport}</p>
                        </div>
                        <!-- Display other club details as needed -->
                    `;
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } else {
    console.log("No club ID provided in the URL.");
  }
}
fetchClubDetails(); // initiate callback
let joinButton = document.getElementById("join");
joinButton.addEventListener("click", () => {
  handleJoin();
});
// join request function
function handleJoin() {
  // Get the UID from localStorage if it exists
  let user = JSON.parse(localStorage.getItem("user"));
  const uid = user.uid;

  if (uid) {
    // Get the club ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const clubId = urlParams.get("id");

    if (clubId) {
      const clubDocRef = doc(firestore, "clubs", clubId);
      console.log(clubDocRef);
      //  return
      // Update the club document with the UID in the pending_requests array
      const updateData = {
        pending_requests: arrayUnion(uid),
      };

      setDoc(clubDocRef, updateData, { merge: true })
        .then(() => {
          alert("Request Sent Successfully");
          console.log("UID stored in pending_requests successfully.");
        })
        .catch((error) => {
          console.error("Error storing UID in pending_requests:", error);
        });
    } else {
      console.log("No club ID provided in the URL.");
    }
  } else {
    console.log("No UID found in localStorage.");
  }
}
// display request to admin
async function allReq() {
  // Get the UID from localStorage if it exists
  let user = JSON.parse(localStorage.getItem("user"));
  const uid = user.uid;

  if (uid) {
    // Get the club ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const clubId = urlParams.get("id");

    if (clubId) {
      const clubDocRef = doc(firestore, "clubs", clubId);

      try {
        // Fetch the club document
        const clubDocSnap = await getDoc(clubDocRef);

        if (clubDocSnap && clubDocSnap.exists()) {
          // Get the pending requests array from the club document
          const clubData = clubDocSnap.data();
          console.log(clubData, "CC");
          const pendingRequests = clubData.pending_requests || [];
          const approvedRequests = clubData.approved_requests || [];

          console.log(pendingRequests.length, "PPP");
          if (pendingRequests.length > 0) {
            const numReqLink = document.getElementById("num_req");
            numReqLink.textContent = `Request for Admin (${pendingRequests.length})`;
          }
          // Iterate over pending requests and display a message for each user
          pendingRequests.forEach(async (pendingUid) => {
            try {
              // Construct a reference to the "users" collection and query for the user with the pending UID
              const usersCollectionRef = collection(firestore, "users");

              const query2 = query(
                usersCollectionRef,
                where("uid", "==", pendingUid)
              );

              const querySnapshot = await getDocs(query2);

              if (!querySnapshot.empty) {
                // User document found, get the first document's data
                const userData = querySnapshot.docs[0].data();
                const username = userData.email;
                console.log(`${username} wants to join your club.`);
                // Display the username in HTML
                // Display the username, tick button, and cross button in HTML
                const adminRequestDiv =
                  document.getElementById("admin-request");

                // Create elements for username, tick button, and cross button
                const usernameElement = document.createElement("p");
                usernameElement.textContent = `${username} wants to join your club.`;

                const tickButton = document.createElement("button");
                tickButton.textContent = "✔️";
                tickButton.classList.add("tick-button"); // Add a CSS class for styling

                const crossButton = document.createElement("button");
                crossButton.textContent = "❌";
                crossButton.classList.add("cross-button"); // Add a CSS class for styling

                // Append elements to adminRequestDiv
                adminRequestDiv.appendChild(usernameElement);
                adminRequestDiv.appendChild(tickButton);
                adminRequestDiv.appendChild(crossButton);

                // Add event listeners for tick and cross buttons if needed
                // Add event listeners for tick and cross buttons
                tickButton.addEventListener("click", async () => {
                  try {
                    // Update the document in the 'clubs' collection to move UID from pending_requests to approved_requests
                    await updateDoc(doc(firestore, "clubs", clubId), {
                      pending_requests: arrayRemove(pendingUid),
                      approved_requests: arrayUnion(pendingUid),
                    });
                    // Update the user's document to add the approved club ID to the 'approvedClubs' array
                    await updateDoc(doc(firestore, "users", pendingUid), {
                      approvedClubs: arrayUnion(clubId),
                    });
                    alert("Pending request has been accepted.");
                    console.log(
                      `${username} has been approved to join the club.`
                    );
                  } catch (error) {
                    console.error("Error updating club document:", error);
                  }
                });

                crossButton.addEventListener("click", () => {
                  // Handle cross button click event
                });
              } else {
                console.log(`User with UID ${pendingUid} not found.`);
              }
            } catch (error) {
              console.error("Error fetching user document:", error);
            }
          });
        } else {
          console.log("Club document does not exist.");
        }
      } catch (error) {
        if (error.code === "permission-denied") {
          console.error("Firestore permission denied error:", error);
          // Handle permission-denied error
        } else {
          console.error("Firestore error:", error);
          // Handle other errors
        }
      }
    } else {
      console.log("No club ID provided in the URL.");
    }
  } else {
    console.log("No UID found in localStorage.");
  }
}

// intiate callback
allReq();

// document.addEventListener("DOMContentLoaded", function () {
//     initAutocomplete();
//   });

// function initAutocomplete() {
//   autocomplete = new google.maps.places.Autocomplete(
//     document.getElementById("eventLocationId"),
//     { types: ["geocode"] }
//   );
//   autocomplete.addListener("place_changed", onPlaceChanged);
// }

// function onPlaceChanged() {
//   var place = autocomplete.getPlace();
//   console.log("Selected Place:", place);

//   // Accessing the geometry object
//   const geometry = place.geometry;

//   // Accessing the location object within geometry
//   const location = geometry.location;

//   // Extracting latitude and longitude
//   const latitude = location.lat();
//   const longitude = location.lng();

//   console.log("Latitude:", latitude);
//   console.log("Longitude:", longitude);

//   eventLocation = { Latitude: latitude, Longitude: longitude };
// }

// // create schedule for an event
// document.getElementById("submitSchedule").addEventListener("click", (event) => {
//   event.preventDefault();
//   submitScheduleForm();
// });

// const submitScheduleForm = async () => {
//   const clubDocRef = doc(firestore, "clubs", id);
//   getDoc(clubDocRef)
//     .then((docSnapshot) => {
//         debugger;
//       if (docSnapshot.exists()) {
//         const clubData = docSnapshot.data();

//         let eventName = document.getElementById("eventName").value;
//         console.log(eventLocation, document.getElementById("eventLocationId").value);
//         let eventLocation = {
//           lat: eventLocation.Latitude,
//           long: eventLocation.Longitude,
//           address: document.getElementById("eventLocationId").value,
//         };
//         let events = [];
//         events.push({
//           eventName,
//           eventLocation,
//         });
//       } else {
//         console.log("No such document!");
//       }
//     })
//     .catch((error) => {
//       console.log("Error getting document:", error);
//     });

  

// //   let user = JSON.parse(localStorage.getItem("user"));
// //   data = {
// //     eventName: eventName,
// //     clubDetails: clubDetails,
// //     // Add other fields if needed
// //     // club id
// //     // array of object of events
// //   };

// //   try {
// //     const clubsCollectionRef = collection(db, "clubs");

// //     // update.query
// //     // club.
// //     const clubDocRef = await addDoc(clubsCollectionRef, data);
// //     alert("Event Successfully Added");
// //   } catch (error) {
// //     console.error("Error creating event: ", error);
// //     alert(error);
// //   }
// };

async function checkAdmin() {
  try {
    // Get the UID from localStorage if it exists
    let user = JSON.parse(localStorage.getItem("user"));
    const uid = user.uid;

    // Get the club ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const clubId = urlParams.get("id");

    if (clubId) {
      const clubDocRef = doc(firestore, "clubs", clubId);

      const clubDocSnap = await getDoc(clubDocRef);

      if (clubDocSnap.exists()) {
        const clubData = clubDocSnap.data();
        const adminId = clubData.admin_id;
        const pendingRequests = clubData.pending_requests || [];
        // const approvedRequests = clubData.approved_requests || [];
        const membersDiv = document.getElementById("members");
        membersDiv.innerHTML = ""; // Clear previous content
        const approvedRequests = clubData.approved_requests || [];
        if (approvedRequests.length > 0) {
          const members = document.getElementById("members_head");
          members.textContent = `Members (${approvedRequests.length})`;
        }
        approvedRequests.forEach(async (approvedUid) => {
          try {
            // Construct a reference to the "users" collection and query for the user with the approved UID
            const usersCollectionRef = collection(firestore, "users");
            const q = query(
              usersCollectionRef,
              where("uid", "==", approvedUid)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              // User document found, get the first document's data
              const userData = querySnapshot.docs[0].data();
              const username = userData.email;

              // Display the username in the "Members Content" section
              const usernameElement = document.createElement("p");
              usernameElement.textContent = username;
              membersDiv.appendChild(usernameElement);
            }
          } catch (error) {
            console.error("Error fetching user document:", error);
          }
        });
        // Check if the user has a pending request
        if (pendingRequests.includes(uid)) {
          console.log("User has a pending request to join the club.");
          document.getElementById("status_wrapper").style.display = "block";
          document.getElementById("join").style.display = "none";
          document.getElementById("joined").style.display = "none";
          document.getElementById("pending").style.display = "block";
          return; // Exit function early since user has a pending request
        }

        // Check if the user has already joined the club
        if (approvedRequests.includes(uid)) {
          console.log("User has already joined the club.");
          document.getElementById("status_wrapper").style.display = "block";
          document.getElementById("join").style.display = "none";
          document.getElementById("pending").style.display = "none";
          document.getElementById("joined").style.display = "block";
          return; // Exit function early since user has already joined
        }

        // If none of the above conditions are met, user can join the club
        document.getElementById("status_wrapper").style.display = "block";
        document.getElementById("join").style.display = "block";
        document.getElementById("joined").style.display = "none";
        document.getElementById("pending").style.display = "none";
        if (adminId === uid) {
          console.log("Current user is the admin of the club.");
          allReq(); // intiate all req function
          document.getElementById("adminRequestTab").style.display = "block";
          document.getElementById("status_wrapper").style.display = "none";
          document.getElementById("admin_mess").style.display = "block";

          // For example: fetchClubDetails(), handleJoin(), allReq(), etc.
        } else {
          console.log("Current user is not the admin of the club.");
          document.getElementById("adminRequestTab").style.display = "none";
        }
      } else {
        console.log("Club document does not exist.");
      }
    } else {
      console.log("No club ID provided in the URL.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkAdmin();
