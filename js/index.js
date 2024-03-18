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
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
let auth = getAuth();

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
// class sHeader extends HTMLElement {
//   connectedCallback() {
//     this.innerHTML = `<nav class="navbar navbar-light" style="background-color: #7BDD4C;">
//     <div class="container-fluid">
//         <a class="navbar-brand" href="index.html">SportsCrush</a>
        
//         <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//             <span class="navbar-toggler-icon"></span>
//         </button>
//         <div class="collapse navbar-collapse" id="navbarSupportedContent">
//             <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              
//             <li class="nav-item">
//             <a class="nav-link" href="login.html">Login</a>
//         </li>
//                 <li class="nav-item">
//                     <a class="nav-link" href="create_club.html">Create Club</a>
//                 </li>
               
//                 <li class="nav-item">
//                     <a class="nav-link" href="myprofile.html">My Profile</a>
//                 </li>
//                 <li class="nav-item">
//                     <a class="nav-link" id="myclubs" style="cursor: pointer;">My Clubs</a>
//                 </li>
//                 <li class="nav-item">
//                     <a class="nav-link" id="manageclubs" style="cursor: pointer;">Manage Clubs</a>
//                 </li>
//                 <li class="nav-item">
//                     <a class="nav-link" id="recommendations" style="cursor: pointer;">Recommendations</a>
//                 </li>
//             </ul>
//         </div>
//     </div>
// </nav>
// `;
//   }
// }
class sHeader extends HTMLElement {
  connectedCallback() {
 this.innerHTML=`<header>
 <div class="logo">
   <a href="index.html" class="logo-link">
     <img src="/assests/images/sportscrush_logo.png" alt="Logo" class="logo">
 </a>
 </div>
 <div class="right-head-wrap">
   <nav>
     <div class="icon" id="bell"> <img src="/assests/images/notifications.png" alt=""> </div>
     <div class="notifications" id="box" style="display: none;">
         <h2>Notifications - <span id="count">2</span></h2>
       
      
     </div>
     <div>
       <a href="myprofile.html" class="name-wrap">
         <div class="circle">
           <div class="letter">K</div>
         </div>
         <span>Hi,Kartavya</span>
       </a>
     </div>
 </nav>
   <img src="/assests/images/list2.png" alt="Logo" class="logo" id="menu">

 </div>

</header>
<div class="sidebar">
<div class="sidebar-child">
  <a class="icon-wrap" id="manageclubs">
  Manage Clubs
  </a>
</div>
<div class="sidebar-child">
  <a class="icon-wrap" id="myclubs">  
My Clubs
  </a>
</div>
<div class="sidebar-child">
  <a class="icon-wrap" href="create_club.html">
 Create Club
  </a>
</div>
<div class="sidebar-child" id="logout">
  <a class="icon-wrap">
 Logout
  </a>
</div>

</div>`
  }
}


customElements.define("s-header", sHeader);
// Wrap the event listener attachment in DOMContentLoaded to ensure the element exists in the DOM
document.addEventListener('DOMContentLoaded', function () {
  // Navigation to myclubs_details.html with type admin
  const myClubsLink = document.getElementById('myclubs');
  console.log(myClubsLink,"================================");
  const managaeCLubLink = document.getElementById('manageclubs');
  const recommendationsLink = document.getElementById('recommendations');
console.log(managaeCLubLink,"MMMMMMM")
  if (myClubsLink) {
    myClubsLink.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default behavior of the anchor tag
      window.location.href = './myclubs_details.html?type=self'; // Navigate to myclubs_details.html with type=admin
    });
  }
  if (managaeCLubLink) {
    managaeCLubLink.addEventListener('click', function (event) {
      // alert('1')
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

// Hamburger conversion
const addContentBtn = document.getElementById('menu');
const sidebar = document.querySelector(".sidebar")


    addContentBtn.addEventListener('click', function () {
        
            sidebar.classList.toggle("show")
      
 
});
// notification-dropdown
document.addEventListener('DOMContentLoaded', function() {
  var down = false;
  var bell = document.getElementById('bell');
  var box = document.getElementById('box');

  bell.addEventListener('click', function() {
    // alert('1')
      if (down) {
          box.style.height = '0px';
          box.style.opacity = '0';
          box.style.display = 'none';
          down = false;
      } else {
          box.style.height = 'auto';
          box.style.opacity = '1';
          box.style.display = 'block';
          down = true;
      }
  });
});




// Function to send notification to a user
 // Listen for new notifications in real-time
 // Get the UID from localStorage if it exists
let user = JSON.parse(localStorage.getItem("user"));
const uid = user?.uid;
 const userDocRef = doc(firestore, "users", uid); // Replace userId with the actual user ID
 let previousNotifications = []; // Use let instead of const to allow reassignment


//  real-time-notifications feature
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
    // if(previousNotifications.length >0){
    //   let lastElement = previousNotifications[previousNotifications.length - 1];

    //   console.log(lastElement);
    //   alert(`${lastElement.title} +${lastElement.message}`)
    // }

    previousNotifications.forEach(notification => {
      const notificationElement = document.createElement('div');
      notificationElement.classList.add('notifications-item'); // Add the class 'notification'
  
      const textElement = document.createElement('div');
      textElement.classList.add('text'); // Add the class 'text'
  
      const titleElement = document.createElement('h4');
      titleElement.textContent = notification.title;
  
      const messageElement = document.createElement('p');
      messageElement.textContent = notification.message;
      
      const imgElement = document.createElement('img');
      imgElement.src = notification.img;
      notificationElement.appendChild(imgElement);
  
      textElement.appendChild(titleElement);
      textElement.appendChild(messageElement);
  
      notificationElement.appendChild(textElement); // Append textElement to notificationElement
  
      document.getElementById('box').appendChild(notificationElement);
  });
  
  } else {
    console.log("User document not found.");
  }
});

// logout -function
document.getElementById("logout").addEventListener("click", function () {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("user");
      alert("logout");
      window.location.href='./entry.html';
    })
    .catch((error) => {
      alert("logout error:", error);
    });
});

