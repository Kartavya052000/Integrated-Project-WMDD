// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC3L-pygyvZqYOGp5Os7swV54Mhno1To88",
    authDomain: "test-8e125.firebaseapp.com",
    databaseURL: "https://test-8e125-default-rtdb.firebaseio.com",
    projectId: "test-8e125",
    storageBucket: "test-8e125.appspot.com",
    messagingSenderId: "675271753145",
    appId: "1:675271753145:web:0f2070f6b149b210608a68",
};

firebase.initializeApp(firebaseConfig); // Initialize Firebase

// Function to create a club
async function createClub(userId, clubName, clubDescription) {
    try {
        // Add club document to "clubs" collection
        const clubRef = await firebase.firestore().collection("clubs").add({
            name: clubName,
            description: clubDescription,
            admin: userId,
        });

        // Add user as admin in the "members" subcollection of the club
        await clubRef.collection("members").doc(userId).set({
            userId: userId,
            role: "admin",
        });

        console.log("Club created successfully!");
    } catch (error) {
        console.error("Error creating club: ", error);
    }
}

// Call the createClub function
createClub("zAuTYTmuOcgGFjI0daHLLCXjZPX2", "My Club", "Club Description");
