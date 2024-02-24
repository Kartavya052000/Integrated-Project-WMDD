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
          if (!clubData.events) {
            document.getElementById("schedule_addbtn").style.display = "block";
          }
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
        .then(async () => {
          alert("Request Sent Successfully");
          console.log("UID stored in pending_requests successfully.");
          await updateDoc(doc(firestore, "users", uid), {
            pending_clubs: arrayUnion(clubId),
          });
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
                      pending_clubs: arrayRemove(clubId),
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

// check for club admin
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
          document.getElementById("users_message").style.display = "block";
          document.getElementById("schedule_addbtn").style.display = "none";
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

// function to show user status

// add schedule intially only for admin
document.getElementById("schedule_addbtn").addEventListener("click", () => {
  document.getElementById("editable_content").style.display = "flex";
  document.getElementById("schedule_addbtn").style.display = "none";
});

// submit to add the schedule
document.getElementById("submit").addEventListener("click", async () => {
  let event_name = document.getElementById("eventName").value;
  let date_time = document.getElementById("datetimepicker").value;
  let location = document.getElementById("location").value;
  let schedule = {
    event_name,
    date_time,
    location,
  };

  // console.log(schedule,id)
  // const clubDocRef = doc(firestore, "clubs", id);
  await updateDoc(doc(firestore, "clubs", id), {
    events: arrayUnion(schedule),
  });
  alert("event saved!");
});
