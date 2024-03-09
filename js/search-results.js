// document.addEventListener("DOMContentLoaded", async function() {
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
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
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

const getCat = async () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  console.log("Category:", category);
  const searchTextLower = category.toLowerCase();

  const q1 = query(
    collection(db, "clubs"),
    where("Sport", ">=", searchTextLower),
    where("Sport", "<=", searchTextLower + "\uf8ff")
  );

  try {
    const querySnapshot1 = await getDocs(q1);
    const resultsArray = querySnapshot1.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    displaySearchResults(resultsArray);
    console.log(resultsArray, "RRR");
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
}

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
                              <p class="card-text">Location: ${JSON.stringify(club.clubDetails.address)}</p>
                              <!-- Add more details as needed -->
                            </div>
                        </div>`;
    });
    searchResultsContainer.innerHTML = htmlcontent;
  } else {
    searchResultsContainer.innerHTML = "No results found";
  }
};

getCat();
