document.addEventListener("DOMContentLoaded", async function() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    console.log("Category:", category);
    if (category) {
      await retrieveData(category); // Fetch search results based on category parameter
      console.log("Search Results:", searchResults);
      displaySearchResults(searchResults); // Render search results on the page
    }
  });
  
//   const retrieveData = async (category) => {
//     try {
//       // Query Firestore to retrieve data based on the category
//       const q = query(collection(db, "clubs"), where("Sport", "==", category));
//       const querySnapshot = await getDocs(q);
//       querySnapshot.forEach((doc) => {
//         searchResults.push(doc.data());
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };
  
  const displaySearchResults = (res) => {
    const searchResultsContainer = document.getElementById("searchResults");
    if (res.length > 0) {
      let htmlcontent = "";
      res.forEach((club) => {
        // Construct HTML for displaying each search result as a card
        htmlcontent += `<div class="card">
                            <div class="card-body">
                              <h5 class="card-title">Club Name: ${club.clubName}</h5>
                              <p class="card-text">Category: ${club.Sport}</p>
                              <p class="card-text">Location: ${JSON.stringify(club.clubDetails)}</p>
                              <!-- Add more details as needed -->
                            </div>
                        </div>`;
      });
      searchResultsContainer.innerHTML = htmlcontent;
    } else {
      searchResultsContainer.innerHTML = "No results found";
    }
  };
  document.addEventListener("DOMContentLoaded", function() {
    const searchResults = JSON.parse(localStorage.getItem("searchResults"));
    if (searchResults) {
        // Display search results on the page
        displaySearchResults(searchResults);
    }
});
  
// // search-results.js
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
// import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// // Your Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyDpN1dFF_d3RhD-ndBd3dGpapZqFAPS7O0",
//     authDomain: "test-7d410.firebaseapp.com",
//     projectId: "test-7d410",
//     storageBucket: "test-7d410.appspot.com",
//     messagingSenderId: "1090057594905",
//     appId: "1:1090057594905:web:ca3f2b2bef00bbb86a2288",
//   };
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Get a reference to the Firestore database service
// const db = getFirestore(app);

// // Function to fetch search results data from Firebase based on the query
// async function fetchSearchResults(query) {
//     try {
//         const clubsCollectionRef = collection(db, "clubs");
//         const querySnapshot = await getDocs(clubsCollectionRef);

//         const searchResults = [];
//         querySnapshot.forEach((doc) => {
//             const club = doc.data();
//             if (club.clubName.toLowerCase().includes(query.toLowerCase()) || club.Sport.toLowerCase().includes(query.toLowerCase())) {
//                 searchResults.push(club);
//             }
//         });

//         return searchResults;
//     } catch (error) {
//         console.error("Error fetching search results:", error);
//         return [];
//     }
// }

// // Function to render search results on the page
// async function renderSearchResults(query) {
//     const searchResults = await fetchSearchResults(query);
//     const searchResultsContainer = document.getElementById("searchResults");

//     if (searchResults.length > 0) {
//         searchResultsContainer.innerHTML = ""; // Clear previous results
//         searchResults.forEach((result) => {
//             const resultElement = document.createElement("div");
//             resultElement.classList.add("card", "mb-3");
//             resultElement.innerHTML = `
//                 <div class="card-body">
//                     <h5 class="card-title">${result.clubName}</h5>
//                     <p class="card-text">Sport: ${result.Sport}</p>
//                     <!-- Add other details as needed -->
//                 </div>
//             `;
//             searchResultsContainer.appendChild(resultElement);
//         });
//     } else {
//         searchResultsContainer.innerHTML = "<p>No results found.</p>";
//     }
// }

// // Retrieve the search query from URL parameter
// const params = new URLSearchParams(window.location.search);
// const query = params.get("query");

// // Render search results when the page loads
// if (query) {
//     renderSearchResults(query);
// } else {
//     // Display a message if no search query is provided
//     document.getElementById("searchResults").innerHTML = "<p>No search query provided.</p>";
// }
