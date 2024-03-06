import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
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

document.getElementById("searchForm").addEventListener("click", async (e) => {
  e.preventDefault();
  debugger;
  let text = document.getElementById("search").value;
  await retrieveData(text); // Wait for data retrieval to complete
  let sr = searchResults;
  searchResults = [];
});

let searchResults = [];

const retrieveData = async (text) => {
  try {
    const searchTextLower = text.toLowerCase();
    const q1 = query(
      collection(db, "clubs"),
      where("Sport", ">=", searchTextLower),
      where("Sport", "<=", searchTextLower + "\uf8ff")
    );

    const q2 = query(
      collection(db, "clubs"),
      where("clubName", ">=", searchTextLower),
      where("clubName", "<=", searchTextLower + "\uf8ff")
    );

    const querySnapshot1 = await getDocs(q1);
    const querySnapshot2 = await getDocs(q2);

    const results1 = querySnapshot1.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      search_type: "category",
    }));
    const results2 = querySnapshot2.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      search_type: "club",
    }));

    const combinedResults = results1.concat(results2);

    combinedResults.sort((a, b) => {
      if (a.Sport && b.Sport) {
        return a.Sport.localeCompare(b.Sport);
      } else if (a.clubName && b.clubName) {
        return a.clubName.localeCompare(b.clubName);
      } else {
        return 0;
      }
    });

    searchResults.push(...combinedResults);
  } catch (err) {
    console.log(err);
  }
};

const showSearchResults = (res) => {
  let rest = document.getElementById("result");

  if (res.length > 0) {
    let htmlcontent = ``;
    res.forEach((ele) => {
      htmlcontent += `<div>
            <img src="${ele.image}">`;
      if (ele.clubName) {
        htmlcontent += `<p>Club Name: ${ele.clubName}</p>`;
      }
      if (ele.Sport) {
        htmlcontent += `<p>Category: ${ele.Sport}</p>`;
      }
      htmlcontent += `<p>Location: ${JSON.stringify(
        ele.clubDetails
      )}</p><p>Members</p>
            </div>`;
    });
    rest.innerHTML = htmlcontent;
  } else {
    rest.innerHTML = "No results found";
  }
};

let timeoutId; // Variable to store the timeout ID

document.getElementById("search").addEventListener("input", async (e) => {
  clearTimeout(timeoutId); // Clear any existing timeout

  // Get the search text from the input field
  let searchText = e.target.value.trim();
  console.log(searchText);
  // If the search text is empty, clear suggestions and return
  if (searchText === "") {
    // alert("hit")
    clearSuggestions();
    return;
  }

  // Set a new timeout to delay the execution of retrieveData
  timeoutId = setTimeout(async () => {
    searchResults = [];
    await retrieveData(searchText); // Wait for data retrieval to complete
    displaySuggestions(searchResults); // Display search suggestions
  }, 300); // Adjust the delay (in milliseconds) as needed
});

document.getElementById("cutButton").addEventListener("click", (e) => {
  document.getElementById("search").value = ""; // Clear the search input field
});
// Function to handle selection from dropdown
document.getElementById("suggestions").addEventListener("click", (e) => {
  console.log(e.target.no);
  // if (e.target && e.target.nodeName == "A") {
  let selectedText = e.target.textContent;
  let selectedType = e.target.dataset.type;
  if (selectedType === "category") {
    window.location.href = `./search-results.html?category=${selectedText
      .split(":")[0]
      .trim()}`;
  } else {
    window.location.href = `./club_details.html?id=${club.id}`;
  }
  document.getElementById("search").value = selectedText;
  clearSuggestions(); // Clear dropdown suggestions
  // }
});
const displaySuggestions = (res) => {
  let suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = ""; // Clear previous suggestions
  if (res.length > 0) {
    res.forEach((ite) => {
      console.log(res);
      let listItem = document.createElement("li");
      let searchType = ite.search_type === "category" ? "Category" : "Club"; // Determine search type based on ite.search_type
      listItem.innerHTML = `<a class="dropdown-item" data-type="${
        ite.search_type
      }">${
        ite.search_type === "category" ? ite.Sport : ite.clubName
      } :${searchType}</a>`;
      suggestionsList.appendChild(listItem);
      listItem.addEventListener("click", function () {
        if (ite.search_type === "category") {
          window.location.href = `./search-results.html?category=${ite.Sport}`;
        } else {
          window.location.href = `./club_details.html?id=${ite.id}`;
        }
      });
    });

    suggestionsList.classList.add("show"); // Show the dropdown
  } else {
    suggestionsList.classList.remove("show"); // Hide the dropdown if no suggestions
  }
};
const clearSuggestions = () => {
  let suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = ""; // Clear suggestions
  suggestionsList.classList.remove("show"); // Hide the dropdown
  searchResults = [];
};
//
