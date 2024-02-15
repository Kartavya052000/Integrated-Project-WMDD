import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


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
                        <h2>Club Name:${clubData.data.clubName}</h2>
                        <p> Club Description: ${clubData.data.clubDescription}</p>
                        <p>Club Address: ${clubData.data.clubDetails.address}</p>
                        <p>Club Category: ${clubData.data.Sport}</p>
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

