import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc ,arrayUnion} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyC3L-pygyvZqYOGp5Os7swV54Mhno1To88",
    authDomain: "test-8e125.firebaseapp.com",
    databaseURL: "https://test-8e125-default-rtdb.firebaseio.com",
    projectId: "test-8e125",
    storageBucket: "test-8e125.appspot.com",
    messagingSenderId: "675271753145",
    appId: "1:675271753145:web:0f2070f6b149b210608a68",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);


function fetchClubDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        const clubDocRef = doc(firestore, "clubs", id);
        getDoc(clubDocRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const clubData = docSnapshot.data();
                    console.log(clubData)
                    const clubDetails = document.getElementById('clubDetails');
                    clubDetails.innerHTML = `
                    <div style="text-align:center">
                        <h2>Club Name:${clubData.clubName}</h2>
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
fetchClubDetails()
let joinButton = document.getElementById("join")
joinButton.addEventListener("click",()=>{

    handleJoin()
})
function handleJoin() {
    // Get the UID from localStorage if it exists
    let user = JSON.parse(localStorage.getItem("user"));
    const uid = user.uid;
    
    if (uid) {
        // Get the club ID from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const clubId = urlParams.get('id');

        if (clubId) {
            const clubDocRef = doc(firestore, "clubs", clubId);
             console.log(clubDocRef)
            //  return
            // Update the club document with the UID in the pending_requests array
            const updateData = {
                "club_requests.pending_requests": arrayUnion(uid)
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
        console.log('No UID found in localStorage.');
    }
}





