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
  onSnapshot,
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

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const clubId = urlParams.get("id");

// Get the UID from localStorage if it exists
let user = JSON.parse(localStorage.getItem("user"));
const uid = user?.uid;

var eventId = "";

// fetch the clubs
let myModal = new bootstrap.Modal(
  document.getElementById("exampleModalCenter")
);

function fetchClubDetails() {
  if (id) {
    const clubDocRef = doc(firestore, "clubs", id);
    getDoc(clubDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const clubData = docSnapshot.data();
          if (!clubData.events) {
            document.getElementById("schedule_addbtn").style.display = "block";
          }
          // Events Schedule tab data for non-admin
          if (clubData.admin_id !== uid) {
            // display schedule for non-admin users of club
            // or show no schedule yet if nothing is available
            if (clubData.events) {
              const eventTableBody = document.getElementById("eventTableBody");
              // document.getElementsByClassName("schedule_table").style.display =
              //   "block";
              // alert('1')

              eventTableBody.innerHTML = "";
              clubData.events.forEach((ite) => {
                const listItem = document.createElement("tr");
                listItem.innerHTML = `
                <td>${ite.event_name}</td>
                <td>${ite.date_time}</td>
                <td>${ite.event_location}</td>
              `;
                let schedule_table = document.querySelector(".schedule_table");
                var headerRow = schedule_table.rows[0];
                headerRow.deleteCell(3);
                eventTableBody.appendChild(listItem);
              });
            } else {
              // alert('1')
              document.querySelector(".schedule_table").style.display = "none";
              document.getElementById("users_message").style.display = "block";
            }
          } else {
            // Events Schedule tab data for admin
            if (clubData.events) {
              const eventTableBody = document.getElementById("eventTableBody");
              eventTableBody.innerHTML = "";
              clubData.events.forEach((ite) => {
                const listItem = document.createElement("tr");
                listItem.innerHTML = `
                <td>${ite.event_name}</td>
                <td>${ite.date_time}</td>
                <td>${ite.event_location}</td>
              `;

                const eventEditButton = document.createElement("td");
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.classList.add("btn");
                
                editButton.addEventListener("click", async () => {
                  try {
                    document.getElementById("submit").style.display = "none";
                    document.getElementById("updateEvent").style.display =
                      "block";
                    myModal.show();
                    const locationInput = document.getElementById("location");

                    let autocompleteEnabled = true; // Flag to track whether autocomplete is enabled

                    locationInput.addEventListener("input", function () {
                      if (autocompleteEnabled) {
                        const inputText = this.value;
                      }
                    });
                    locationInput.addEventListener("keydown", function () {
                      autocompleteEnabled = false;
                    });
                    locationInput.addEventListener("blur", function () {
                      autocompleteEnabled = true;
                    });

                    document.getElementById("eventName").value = ite.event_name;
                    document.getElementById("datetimepicker").value =
                      ite.date_time;
                    document.getElementById("location").value =
                      ite.event_location;
                    eventId = ite.eventId;
                    let updateEvent = {
                      eventId: ite.eventId,
                      event_name: document.getElementById("eventName").value,
                      date_time:
                        document.getElementById("datetimepicker").value,
                      location: document.getElementById("location").value,
                    };

                    await updateDoc(doc(firestore, "clubs", id), {
                      events: arrayRemove(
                        clubData.events.find(
                          (event) => event.eventId === ite.eventId
                        )
                      ),
                    });

                    // Update the event in Firestore
                    await updateDoc(doc(firestore, "clubs", id), {
                      events: arrayUnion(updateEvent),
                    });
                  } catch (error) {
                    alert(error);
                  }
                });
                eventEditButton.appendChild(editButton);
                listItem.appendChild(eventEditButton);

                const eventRemoveButton = document.createElement("td");
                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.classList.add("btn");
                removeButton.addEventListener("click", async () => {
                  try {
                    await updateDoc(doc(firestore, "clubs", id), {
                      events: arrayRemove(
                        clubData.events.find(
                          (event) => event.eventId === ite.eventId
                        )
                      ),
                    });
                    listItem.remove(); // Remove the <tr> element from the table

                    alert("Event removed!");
                  } catch (error) {
                    alert(error);
                  }
                });
                eventRemoveButton.appendChild(removeButton);
                listItem.appendChild(eventRemoveButton);

                eventTableBody.appendChild(listItem);
              });
            }
          }

          const clubDetails = document.getElementById("clubDetails");
          clubDetails.innerHTML = `
                    <div class="club-div" >
                       
                        <div class="club-img"><img src=${clubData.addressOfImage} alt=${clubData.clubName}  ></div>
                         <div class="club-data">
                           <h2 class="club-title">  ${clubData.clubName}</h2>
                           <p class="category"> ${clubData.Sport}</p>
                           <p> <i class="fa-solid fa-location-dot" style="color: #bdff9e;"></i> ${clubData.clubDetails.address}</p>
                           <p> <i class="fa-solid fa-book" style="color: #bdff9e;"></i> ${clubData.clubDescription}</p>
                         </div>
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
// function handleJoin() {
//   if (uid) {
//     // Get the club ID from the URL
//     if (clubId) {
//       const clubDocRef = doc(firestore, "clubs", clubId);
//       console.log(clubDocRef);
//       //  return
//       // Update the club document with the UID in the pending_requests array

//       const updateData = {
//         pending_requests: arrayUnion(uid),
//       };

//       setDoc(clubDocRef, updateData, { merge: true })
//         .then(async () => {
//           alert("Request Sent Successfully");
//           console.log("UID stored in pending_requests successfully.");

//           fetchClubDetails(); // call to update the page
//         })
//         .catch((error) => {
//           console.error("Error storing UID in pending_requests:", error);
//         });
//     } else {
//       console.log("No club ID provided in the URL.");
//     }
//   } else {
//     console.log("No UID found in localStorage.");
//   }
// }
// join request function
function handleJoin() {
  if (uid) {
    // Get the club ID from the URL
    if (clubId) {
      const clubDocRef = doc(firestore, "clubs", clubId);

      // Fetch the club document
      getDoc(clubDocRef)
        .then((clubDoc) => {
          if (clubDoc.exists()) {
            const clubData = clubDoc.data();
            console.log(clubData.clubDetails.clubType);
            // Check if the club type is private
            if (clubData.clubDetails.clubType === "private") {
              // If the club is private, send a join request
              const updateData = {
                pending_requests: arrayUnion(uid),
              };

              setDoc(clubDocRef, updateData, { merge: true })
                .then(() => {
                  alert("Request Sent Successfully");
                  console.log("UID stored in pending_requests successfully.");
                  fetchClubDetails(); // call to update the page
                })
                .catch((error) => {
                  console.error(
                    "Error storing UID in pending_requests:",
                    error
                  );
                });
            } else if (clubData.clubDetails.clubType === "public") {
              // If the club is public, join the club immediately
              const updateData = {
                approved_requests: arrayUnion(uid),
              };

              setDoc(clubDocRef, updateData, { merge: true })
                .then(() => {
                  alert("Joined the club successfully");
                  console.log("UID stored in approved_requests successfully.");
                  fetchClubDetails(); // call to update the page
                })
                .catch((error) => {
                  console.error(
                    "Error storing UID in approved_requests:",
                    error
                  );
                });
            } else {
              console.error(
                "Invalid club type:",
                clubData.clubDetails.clubType
              );
            }
          } else {
            console.log("Club document does not exist.");
          }
        })
        .catch((error) => {
          console.error("Error fetching club document:", error);
        });
    } else {
      console.log("No club ID provided in the URL.");
    }
  } else {
    console.log("No UID found in localStorage.");
  }
}

// display request to admin
// async function allReq() {
//   if (uid) {
//     if (clubId) {
//       const clubDocRef = doc(firestore, "clubs", clubId);

//       try {
//         // Fetch the club document
//         const clubDocSnap = await getDoc(clubDocRef);

//         if (clubDocSnap && clubDocSnap.exists()) {
//           // Get the pending requests array from the club document
//           const clubData = clubDocSnap.data();
//           console.log(clubData, "CC");
//           const pendingRequests = clubData.pending_requests || [];
//           // const approvedRequests = clubData.approved_requests || [];

//           console.log(pendingRequests.length, "PPP");
//           if (pendingRequests.length > 0) {
//             const numReqLink = document.getElementById("num_req");
//             numReqLink.textContent = `Request for Admin (${pendingRequests.length})`;
//           }
//           // Iterate over pending requests and display a message for each user
//           pendingRequests.forEach(async (pendingUid) => {
//             try {
//               // Construct a reference to the "users" collection and query for the user with the pending UID
//               const usersCollectionRef = collection(firestore, "users");

//               const query2 = query(
//                 usersCollectionRef,
//                 where("uid", "==", pendingUid)
//               );

//               const querySnapshot = await getDocs(query2);

//               if (!querySnapshot.empty) {
//                 // User document found, get the first document's data
//                 const userData = querySnapshot.docs[0].data();
//                 const username = userData.email;
//                 console.log(`${username} wants to join your club.`);
//                 // Display the username in HTML
//                 // Display the username, tick button, and cross button in HTML
//                 const adminRequestDiv =
//                   document.getElementById("admin-request");

//                 // Create elements for username, tick button, and cross button
//                 const usernameElement = document.createElement("p");
//                 usernameElement.textContent = `${username} wants to join your club.`;

//                 const tickButton = document.createElement("button");
//                 tickButton.textContent = "✔️";
//                 tickButton.classList.add("tick-button"); // Add a CSS class for styling

//                 const crossButton = document.createElement("button");
//                 crossButton.textContent = "❌";
//                 crossButton.classList.add("cross-button"); // Add a CSS class for styling
//                 console.log(adminRequestDiv);
//                 // Append elements to adminRequestDiv
//                 adminRequestDiv.appendChild(usernameElement);
//                 adminRequestDiv.appendChild(tickButton);
//                 adminRequestDiv.appendChild(crossButton);

//                 // Add event listeners for tick and cross buttons if needed
//                 // Add event listeners for tick and cross buttons
//                 tickButton.addEventListener("click", async () => {
//                   try {
//                     // Update the document in the 'clubs' collection to move UID from pending_requests to approved_requests
//                     await updateDoc(doc(firestore, "clubs", clubId), {
//                       pending_requests: arrayRemove(pendingUid),
//                       approved_requests: arrayUnion(pendingUid),
//                     });
//                     // Update the user's document to add the approved club ID to the 'approvedClubs' array
//                     await updateDoc(doc(firestore, "users", pendingUid), {
//                       pending_clubs: arrayRemove(clubId),
//                       approvedClubs: arrayUnion(clubId),
//                     });
//                     // alert("Pending request has been accepted.");
//                     document.getElementById("join").style.display = "none";
//                     // document.getElementById("joined").style.display = "none";
//                     document.getElementById("pending").style.display = "block";
//                     SendNotification(pendingUid,clubData.clubName,"Your request has been Declined")
//                     console.log(
//                       `${username} has been approved to join the club.`
//                     );
//                   } catch (error) {
//                     console.error("Error updating club document:", error);
//                   }
//                 });

//                 crossButton.addEventListener("click", async () => {
//                   // Handle cross button click event
//                   console.log("crossButton is clicked");
//                   try {
//                     // Update the document in the 'clubs' collection to move UID from pending_requests to approved_requests
//                     await updateDoc(doc(firestore, "clubs", clubId), {
//                       pending_requests: arrayRemove(pendingUid),
//                       // approved_requests: arrayUnion(pendingUid),
//                     });
//                     // Update the user's document to add the approved club ID to the 'approvedClubs' array
//                     await updateDoc(doc(firestore, "users", pendingUid), {
//                       pending_clubs: arrayRemove(clubId),
//                       declined_requests: arrayUnion(clubId),
//                     });
//                     console.log("inside try after")
//                     SendNotification(pendingUid,clubData.clubName,"Your user has been successfully accepted")

//                     // alert("Pending request has been rejected.");
//                     console.log(
//                       `${username} has been rejected to join the club.`
//                     );
//                   } catch (error) {
//                     console.error("Error updating club document:", error);
//                   }
//                 });
//               } else {
//                 console.log(`User with UID ${pendingUid} not found.`);
//               }
//             } catch (error) {
//               console.error("Error fetching user document:", error);
//             }
//           });
//         } else {
//           console.log("Club document does not exist.");
//         }
//       } catch (error) {
//         if (error.code === "permission-denied") {
//           console.error("Firestore permission denied error:", error);
//           // Handle permission-denied error
//         } else {
//           console.error("Firestore error:", error);
//           // Handle other errors
//         }
//       }
//     } else {
//       console.log("No club ID provided in the URL.");
//     }
//   } else {
//     console.log("No UID found in localStorage.");
//   }
// }
async function allReq() {
  if (uid) {
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

          console.log(pendingRequests.length, "PPP");
          // if (pendingRequests.length > 0) {
          //   const numReqLink = document.getElementById("num_req");
          //   numReqLink.textContent = `Request for Admin (${pendingRequests.length})`;
          // }

          // Subscribe to real-time updates for pending_requests
          const unsubscribe = onSnapshot(clubDocRef, (snapshot) => {
            if (snapshot.exists()) {
              const clubData = snapshot.data();
              const pendingRequests = clubData.pending_requests || [];
              if (pendingRequests.length > 0) {
                const numReqLink = document.getElementById("num_req");
                numReqLink.textContent = `Request for Admin (${pendingRequests.length})`;
              }
              // Clear previous content before updating
              const adminRequestDiv = document.getElementById("admin-request");
              adminRequestDiv.innerHTML = "";
// alert('1')
// console.log(pendingRequests,"CCC")
              pendingRequests.forEach(async (pendingUid) => {
                try {
                  // Construct a reference to the "users" collection and query for the user with the pending UID
                  const usersCollectionRef = collection(firestore, "users");
                  const query2 = query(
                    usersCollectionRef,
                    where("uid", "==", pendingUid)
                  );
                  const querySnapshot = await getDocs(query2);
console.log(querySnapshot,"QQQQQQ")
                  if (!querySnapshot.empty) {
                    // alert('2')
                    // User document found, get the first document's data
                    const userData = querySnapshot.docs[0].data();
                    const username = userData.email;

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
// alert('hit')
                    // Append elements to adminRequestDiv
                    adminRequestDiv.appendChild(usernameElement);
                    adminRequestDiv.appendChild(tickButton);
                    adminRequestDiv.appendChild(crossButton);

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

                        // Hide join button and show pending status
                        document.getElementById("join").style.display = "none";
                        document.getElementById("pending").style.display =
                          "block";

                        // Send notification
                        SendNotification(
                          pendingUid,
                          clubData.clubName,
                          clubData.addressOfImage,
                          "Your request has been accepted"
                        );

                        console.log(
                          `${username} has been approved to join the club.`
                        );
                      } catch (error) {
                        console.error("Error updating club document:", error);
                      }
                    });

                    crossButton.addEventListener("click", async () => {
                      try {
                        // Update the document in the 'clubs' collection to remove UID from pending_requests
                        await updateDoc(doc(firestore, "clubs", clubId), {
                          pending_requests: arrayRemove(pendingUid),
                        });

                        // Update the user's document to add the declined club ID to the 'declined_requests' array
                        await updateDoc(doc(firestore, "users", pendingUid), {
                          pending_clubs: arrayRemove(clubId),
                          declined_requests: arrayUnion(clubId),
                        });

                        // Send notification
                        SendNotification(
                          pendingUid,
                          clubData.clubName,
                          clubData.addressOfImage,
                          "Your request has been declined"
                        );

                        console.log(
                          `${username} has been rejected to join the club.`
                        );
                      } catch (error) {
                        console.error("Error updating club document:", error);
                      }
                    });
                  } else {
                    console.log(`User with UID ${pendingUid} not found.`);
                  }
                } catch (error) {
                  console.error("Error fetching user document:", error);
                }
              });
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

// check for club admin
async function checkAdmin() {
  try {
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
        // Subscribe to real-time updates for approved_requests
        const approvedRequests = clubData.approved_requests || [];

        const unsubscribeApprovedRequests = onSnapshot(
          clubDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const clubData = snapshot.data();
              const approvedRequests = clubData.approved_requests || [];

              // Clear previous content before updating
              const membersDiv = document.getElementById("members");
              membersDiv.innerHTML = ""; // Clear previous content

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
            }
          }
        );

        // Don't forget to unsubscribe when it's no longer needed
        // unsubscribeApprovedRequests();

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
          // getReq()
          // alert('1')
          // document.getElementById("schedule_addbtn").style.display = "block";

          document.getElementById("adminRequestTab").style.display = "block";
          document.getElementById("status_wrapper").style.display = "none";
          document.getElementById("admin_mess").style.display = "flex";
          document.getElementById("schedule_addbtn").style.display = "block";
        } else {
          // alert('2')
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
  document.getElementById("submit").style.display = "block";
  document.getElementById("updateEvent").style.display = "none";
  myModal.show();
});

//update event
document.getElementById("updateEvent").addEventListener("click", async (e) => {
  // Get the updated event data from the form fields
  let event_name = document.getElementById("eventName").value;
  let date_time = document.getElementById("datetimepicker").value;
  let location = document.getElementById("location").value;

  // Retrieve club data from Firestore
  const clubDocRef = doc(firestore, "clubs", id);
  const docSnapshot = await getDoc(clubDocRef);

  if (docSnapshot.exists()) {
    const clubData = docSnapshot.data();
    console.log(clubData);

    // Create an object with the updated event data
    let updatedEvent = {
      eventId: eventId,
      event_name: event_name,
      date_time: date_time,
      event_location: location,
    };
    console.log(updatedEvent, "UU");
    // return
    // Find the index of the event to be updated in the events array
    let index = clubData.events.findIndex((event) => event.eventId === eventId);

    // Remove the existing event from the events array
    await updateDoc(doc(firestore, "clubs", id), {
      events: arrayRemove(clubData.events[index]),
    });

    // Update the events array with the updated event data
    await updateDoc(doc(firestore, "clubs", id), {
      events: arrayUnion(updatedEvent),
    });

    // Hide the modal
    myModal.hide();

    // Display an alert to indicate that the event has been updated
    alert("Event updated!");

    // Fetch the updated club details to refresh the UI
    fetchClubDetails();
  }
});

// submit to add the schedule
document.getElementById("submit").addEventListener("click", async () => {
  let event_name = document.getElementById("eventName").value;
  let date_time = document.getElementById("datetimepicker").value;
  let location = document.getElementById("location").value;
  let schedule = {
    eventId: uuidv4(),
    event_name,
    date_time,
    event_location: location,
  };
  console.log(schedule);
  // return
  await updateDoc(doc(firestore, "clubs", id), {
    events: arrayUnion(schedule),
  });

  alert("event saved!");
  myModal.hide();
  fetchClubDetails();
  document.getElementById("eventName").value = "";
  document.getElementById("datetimepicker").value = "";
  document.getElementById("location").value = "";
});

// function to handle Notifications
const SendNotification = (user_id, clubName,clubImg, message) => {
  const userDocRef = doc(firestore, "users", user_id);
  console.log(userDocRef);
  //  return
  let obj = {
    title: clubName,
    img:clubImg,
    message: message,
  };
  console.log(obj);
  // Update the club document with the UID in the pending_requests array
  const updateData = {
    notifications: arrayUnion(obj),
  };

  setDoc(userDocRef, updateData, { merge: true })
    .then(async () => {
      alert("Notification Sent Successfully");
      // console.log("UID stored in pending_requests successfully.");

      // fetchClubDetails(); // call to update the page
    })
    .catch((error) => {
      console.error("Error storing UID in pending_requests:", error);
    });
};
let prevreq = [];
//  function to get real-time request
// const getReq =  async () =>{
//   if (uid) {
//     if (clubId) {
//       let user = JSON.parse(localStorage.getItem("user"));
//       const uid = user.uid;
//       const clubDocRef = doc(firestore, "clubs", clubId);
//       let previousNotifications = []; // Use let instead of const to allow reassignment

//        const unsubscribe = onSnapshot(clubDocRef, (doc) => {
//         if (doc.exists()) {
//           const clubData = doc.data();
//           const currentrequests = clubData.pending_requests || [];

//           // Compare previous and current notifications arrays to detect added notifications
//           const addrequests = currentrequests.filter(req => !prevreq.includes(req));
//           // Add new notifications to previousNotifications array
//           prevreq=[] // empty previus array here
//           prevreq.push(...addrequests);
//           console.log("All req:", prevreq);
//           prevreq.forEach(async (pendingUid) => {
//             try {
//               // Construct a reference to the "users" collection and query for the user with the pending UID
//               const usersCollectionRef = collection(firestore, "users");

//               const query2 = query(
//                 usersCollectionRef,
//                 where("uid", "==", pendingUid)
//               );

//               const querySnapshot = await getDocs(query2);

//               if (!querySnapshot.empty) {
//                 // User document found, get the first document's data
//                 const userData = querySnapshot.docs[0].data();
//                 const username = userData.email;
//                 console.log(`${username} wants to join your club.`);
//                 // Display the username in HTML
//                 // Display the username, tick button, and cross button in HTML
//                 const adminRequestDiv =
//                   document.getElementById("admin-request");

//                 // Create elements for username, tick button, and cross button
//                 const usernameElement = document.createElement("p");
//                 usernameElement.textContent = `${username} wants to join your club.`;

//                 const tickButton = document.createElement("button");
//                 tickButton.textContent = "✔️";
//                 tickButton.classList.add("tick-button"); // Add a CSS class for styling

//                 const crossButton = document.createElement("button");
//                 crossButton.textContent = "❌";
//                 crossButton.classList.add("cross-button"); // Add a CSS class for styling
//                 console.log(adminRequestDiv);
//                 // Append elements to adminRequestDiv
//                 adminRequestDiv.appendChild(usernameElement);
//                 adminRequestDiv.appendChild(tickButton);
//                 adminRequestDiv.appendChild(crossButton);

//                 // Add event listeners for tick and cross buttons if needed
//                 // Add event listeners for tick and cross buttons
//                 tickButton.addEventListener("click", async () => {
//                   try {
//                     // Update the document in the 'clubs' collection to move UID from pending_requests to approved_requests
//                     await updateDoc(doc(firestore, "clubs", clubId), {
//                       pending_requests: arrayRemove(pendingUid),
//                       approved_requests: arrayUnion(pendingUid),
//                     });
//                     // Update the user's document to add the approved club ID to the 'approvedClubs' array
//                     await updateDoc(doc(firestore, "users", pendingUid), {
//                       pending_clubs: arrayRemove(clubId),
//                       approvedClubs: arrayUnion(clubId),
//                     });
//                     // alert("Pending request has been accepted.");
//                     document.getElementById("join").style.display = "none";
//                     // document.getElementById("joined").style.display = "none";
//                     document.getElementById("pending").style.display = "block";
//                     SendNotification(pendingUid,clubData.clubName,"Your request has been Declined")
//                     console.log(
//                       `${username} has been approved to join the club.`
//                     );
//                   } catch (error) {
//                     console.error("Error updating club document:", error);
//                   }
//                 });

//                 crossButton.addEventListener("click", async () => {
//                   // Handle cross button click event
//                   console.log("crossButton is clicked");
//                   try {
//                     // Update the document in the 'clubs' collection to move UID from pending_requests to approved_requests
//                     await updateDoc(doc(firestore, "clubs", clubId), {
//                       pending_requests: arrayRemove(pendingUid),
//                       // approved_requests: arrayUnion(pendingUid),
//                     });
//                     // Update the user's document to add the approved club ID to the 'approvedClubs' array
//                     await updateDoc(doc(firestore, "users", pendingUid), {
//                       pending_clubs: arrayRemove(clubId),
//                       declined_requests: arrayUnion(clubId),
//                     });
//                     console.log("inside try after")
//                     SendNotification(pendingUid,clubData.clubName,"Your user has been successfully accepted")

//                     // alert("Pending request has been rejected.");
//                     console.log(
//                       `${username} has been rejected to join the club.`
//                     );
//                   } catch (error) {
//                     console.error("Error updating club document:", error);
//                   }
//                 });
//               } else {
//                 console.log(`User with UID ${pendingUid} not found.`);
//               }
//             } catch (error) {
//               console.error("Error fetching user document:", error);
//             }
//           });
//         } else {
//           console.log("User document not found.");
//         }
//       });
//     } else {
//       console.log("No club ID provided in the URL.");
//     }
//   } else {
//     console.log("No UID found in localStorage.");
//   }

// }
//implementing autocomplete
var autocomplete;
let clubLocation;
// Manual initialization after the script has loaded
document.addEventListener("DOMContentLoaded", function () {
  initAutocomplete();
});

// modal close
document.getElementById("close-icon").addEventListener("click", function () {
  myModal.hide();

})
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

  const geometry = place.geometry;
  const location = geometry.location;

  // Extracting latitude and longitude
  const latitude = location.lat();
  const longitude = location.lng();
  clubLocation = { Latitude: latitude, Longitude: longitude };
}
