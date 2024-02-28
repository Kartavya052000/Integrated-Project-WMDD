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
    measurementId: "G-9CS7TKRD9H"
  };

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
// Initialize Firebase authentication
const auth = getAuth();


const myClubs = async (userId) => {
    try {
      // Query clubs collection where the user's UID is in the approved_requests array
      const clubsQuery = query(collection(firestore, 'clubs'), where('approved_requests', 'array-contains', userId));
      
      // Get the snapshot of clubs
      const clubsSnapshot = await getDocs(clubsQuery);
      
      const clubs = [];
      
      // Iterate through the clubs snapshot
      clubsSnapshot.forEach((doc) => {
        // Get club data
        const clubData = doc.data();
        
        // Add club data to the clubs array
        clubs.push({
          id: doc.id,
          ...clubData
        });
      });
      
      return clubs;
    } catch (error) {
      console.error("Error fetching clubs:", error);
      return [];
    }
  }
  const managaeClubs = async (userId) => {
    try {
      // Query clubs collection where the user's UID is in the approved_requests array
      const clubsQuery = query(collection(firestore, 'clubs'), where('admin_id', '==', userId)  // Filtering clubs where the 'admin_id' field equals userId
      );
      
      // Get the snapshot of clubs
      const clubsSnapshot = await getDocs(clubsQuery);
      
      const clubs = [];
      
      // Iterate through the clubs snapshot
      clubsSnapshot.forEach((doc) => {
        // Get club data
        const clubData = doc.data();
        
        // Add club data to the clubs array
        clubs.push({
          id: doc.id,
          ...clubData
        });
      });
      
      return clubs;
    } catch (error) {
      console.error("Error fetching clubs:", error);
      return [];
    }
  }
  let user = JSON.parse(localStorage.getItem("user"));
  const uid = user.uid;
  const clubsList = document.getElementById('clubs_list');
  // Usage:
//   const userId = "user_uid_here";
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");
console.log(type);
if(type=='self'){
  document.getElementById("titlehead").textContent = "My Clubs";
  myClubs(uid)
    .then((clubs) => {
        console.log("User's clubs:", clubs);
        // Display clubs on the page
        if(clubs.length>0){

        clubs.forEach((club) => {
            const clubElement = document.createElement('div');
            clubElement.classList.add('club');
            clubElement.innerHTML = `
                <h3>${club.clubName}</h3>
                <p>Description: ${club.clubDescription}</p>
                <p>Location: ${club.clubDetails.address}</p>
                <!-- Add more details as needed -->
            `;
            clubElement.addEventListener('click', function() {
                window.location.href = `./club_details.html?id=${club.id}`;
            });
            clubsList.appendChild(clubElement);
        });
    }else{
      const clubElement = document.createElement('div');
        clubElement.classList.add('club_card');
        clubElement.innerHTML = `
            <h3>No Clubs  to Show</h3>
        
        `;
        clubsList.appendChild(clubElement);  
    }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}else{
  document.getElementById("titlehead").textContent = "Manage Clubs";

    managaeClubs(uid)
    .then((clubs) => {
        console.log("User's clubs:", clubs);
        // Display clubs on the page
        if(clubs.length>0){
            clubs.forEach((club) => {
                const clubElement = document.createElement('div');
                clubElement.classList.add('club_card');
                clubElement.innerHTML = `
                    <h3>${club.clubName}</h3>
                    <p>Description: ${club.clubDescription}</p>
                    <p>Location: ${club.clubDetails.address}</p>
                    <!-- Add more details as needed -->
                `;
                clubElement.addEventListener('click', function() {
                    window.location.href = `./club_details.html?id=${club.id}`;
                });
                clubsList.appendChild(clubElement);
            });
        }else{
            const clubElement = document.createElement('div');
            clubElement.classList.add('club_card');
            clubElement.innerHTML = `
                <h3>No Clubs  to Show</h3>
            
            `;
            clubsList.appendChild(clubElement);
        }
      
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}



  