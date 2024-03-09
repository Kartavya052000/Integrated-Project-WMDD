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
  onSnapshot
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
class sHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<nav class="navbar navbar-light" style="background-color: lightgreen;">
    <div class="container-fluid">
        <a class="navbar-brand" href="index.html">SportsCrush</a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              
                <li class="nav-item">
                    <a class="nav-link" href="create_club.html">Create Club</a>
                </li>
               
                <li class="nav-item">
                    <a class="nav-link" href="myprofile.html">My Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="myclubs" style="cursor: pointer;">My Clubs</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="manageclubs" style="cursor: pointer;">Manage Clubs</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="recommendations" style="cursor: pointer;">Recommendations</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
`;
  }
}

customElements.define("s-header", sHeader);
// Wrap the event listener attachment in DOMContentLoaded to ensure the element exists in the DOM
document.addEventListener('DOMContentLoaded', function () {
  // Navigation to myclubs_details.html with type admin
  const myClubsLink = document.getElementById('myclubs');
  const managaeCLubLink = document.getElementById('manageclubs');
  const recommendationsLink = document.getElementById('recommendations');

  if (myClubsLink) {
    myClubsLink.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default behavior of the anchor tag
      window.location.href = './myclubs_details.html?type=self'; // Navigate to myclubs_details.html with type=admin
    });
  }
  if (managaeCLubLink) {
    managaeCLubLink.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default behavior of the anchor tag
      window.location.href = './myclubs_details.html?type=admin'; // Navigate to myclubs_details.html with type=admin
    });
  }
  if (recommendationsLink) {
    recommendationsLink.addEventListener('click', function (event) {
      event.preventDefault(); 
      window.location.href = './myclubs_details.html?type=recommendations';
    });
  }
});

// Function to send notification to a user
 // Listen for new notifications in real-time
 // Get the UID from localStorage if it exists
let user = JSON.parse(localStorage.getItem("user"));
const uid = user.uid;
 const userDocRef = doc(firestore, "users", uid); // Replace userId with the actual user ID
 let previousNotifications = []; // Use let instead of const to allow reassignment

 const unsubscribe = onSnapshot(userDocRef, (doc) => {
  if (doc.exists()) {
    const userData = doc.data();
    const currentNotifications = userData.notifications || [];

    // Compare previous and current notifications arrays to detect added notifications
    const addedNotifications = currentNotifications.filter(notification => !previousNotifications.includes(notification));

  

    // Add new notifications to previousNotifications array
    previousNotifications=[] // empty previus array here
    previousNotifications.push(...addedNotifications);
    console.log("All Notification:", previousNotifications);
    previousNotifications.forEach(notification => {
      const notificationElement = document.createElement('div');
      notificationElement.textContent = `${notification.title}: ${notification.message}`;
      document.getElementById('notifications-dummy').appendChild(notificationElement);
    });
  } else {
    console.log("User document not found.");
  }
});
