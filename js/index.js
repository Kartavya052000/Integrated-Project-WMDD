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
 this.innerHTML=`
 <header>
 <div id="offline-message">
    <p>No internet connection. Please check your network settings and try again.</p>
  </div>
 <div class="logo">
   <a href="index.html" class="logo-link">
     <img src="/assests/images/sportscrush_logo.png" alt="Logo" class="logo">
 </a>
 </div>
 <div class="right-head-wrap">
   <nav>
     <div class="icon" id="bell"> <img src="/assests/images/notifications.png" alt=""> </div>
     <div class="icon" id="bellon" style="display:none"> <img src="/assests/images/bell-on.png" alt=""> </div>
     <div class="notifications" id="box" style="display: none;">
         <h2>Notifications - <span id="count">2</span></h2>
     </div>
     <div>
   
       <a href="myprofile.html" class="name-wrap">
         <div class="circle">
           <div class="letter">K</div>
         </div>
         <span class="name" id="nameval">Hi,</span>
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
window.addEventListener('load', function() {
  function updateOnlineStatus(event) {
    var offlineMessage = document.getElementById('offline-message');
    if (!navigator.onLine) {
      offlineMessage.style.display = 'flex';
    } else {
      offlineMessage.style.display = 'none';

      // alert("you are online")
    }
  }

  window.addEventListener('online',  updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  updateOnlineStatus(); // Check status on page load
});


customElements.define("s-header", sHeader);
// Wrap the event listener attachment in DOMContentLoaded to ensure the element exists in the DOM
document.addEventListener('DOMContentLoaded', async function  () {
  // Navigation to myclubs_details.html with type admin

  // name on header
  let name = document.getElementById('nameval')
  let localval=JSON.parse(localStorage.getItem("user"))
  const userCollection = collection(getFirestore(), "users");
  const userDocRef = doc(userCollection, localval.uid);

  const docSnapshot = await getDoc(userDocRef);

  if (docSnapshot.exists()) {
    const userData = docSnapshot.data();
console.log(userData,"UU")
if(userData.username){
  // console.log(localval,"localval")
  name.innerHTML+=userData.username
    }else{
      name.innerHTML+="User"

    }
  }
  



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
        
            sidebar.classList.toggle("show-sidebar")
      
 
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

const clubsList = document.getElementById('recommendations');
  recommendedClubs(uid)
    .then((clubs) => {
      // Display clubs on the page
      if (clubs.length > 0) {
        clubs.forEach((club) => {
          
          const clubElement = document.createElement('div');
          clubElement.classList.add('club_card');
          clubElement.innerHTML = `
          <div
            class="card"
            style="
              width: 260px;
              border-radius: 20px;
              background-color: black;
              border: 1px solid green;
            "
          >
            <img
            src="${club.addressOfImage}"
              alt=""
              style="
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
              "
            />
            <div
              class="btn-h3-wrap"
              style="
                display: flex;
                margin: 10px;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div class="h3-p-wrap">
                <h3 style="color: green; font-size: 18px"> ${club.clubName}</h3>
                <p style="font-size: 14px; margin: 0">${club.Sport}</p>
              </div>
              <button
                class="join-btn"
                style="
                  height: 30px;
                  width: 70px;
                  font-size: 14px;
                  border-radius: 20px;
                  border-color: transparent;
                  background-color: green;
                  font-weight: 500;
                  line-height: normal;
                "
              >
                Join
              </button>
            </div>
          </div>
              `;
          clubElement.addEventListener('click', function () {
            window.location.href = `./club_details.html?id=${club.id}`;
          });
          clubsList.appendChild(clubElement);
        });
      } else {
        const clubElement = document.createElement('div');
        clubElement.classList.add('club_card');
        clubElement.innerHTML = `
              <p id="noClubsMessage">No Clubs  to Show</p>
          `;
        clubsList.appendChild(clubElement);
      }

    })
    .catch((error) => {
      console.error("Error:", error);
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
    console.log("All Notification:", previousNotifications.length);
    let bellOn= document.getElementById('bellon')
    let bellzero= document.getElementById('bell')

    if(previousNotifications.length ==0){
   
      bellOn.style.display="none"
      bellzero.style.display="block"

    }else{
      bellzero.style.display="none"
      bellOn.style.display="block"

     
    }
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


const recommendedClubs = async (uid) => {
  try {
    const userCollection = collection(getFirestore(), "users");
    const userDocRef = doc(userCollection, uid);

    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      //show clubs with sport equal to current users interested sport 
      const clubsQuery = query(collection(firestore, 'clubs'), where('sportToken', '==', userData.sports_interest));
      const clubsSnapshot = await getDocs(clubsQuery);

      const clubJson=JSON.stringify(clubsSnapshot);
      const clubs = [];
      // console.log(clubJson)
      // clubsSnapshot.forEach((doc) => {
      //   const clubData = doc.data();
      //   const clubJson = JSON.stringify(clubData);
      //   clubs.push(JSON.parse(clubJson)); // Optional: If you need to work with the JSON objects in JavaScript format instead of strings
      // });
      

      clubsSnapshot.forEach((doc) => {
        const clubData = doc.data();
        clubs.push({
          id: doc.id,
          ...clubData
        });
      });
      return clubs;
    } else {
      console.log("User document does not exist");
      return [];
    }
  } catch (error) {
    console.error("Error fetching recommended clubs:", error);
    return [];
  }
}

