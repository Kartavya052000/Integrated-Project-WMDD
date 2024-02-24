import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, collection, doc,addDoc, setDoc, getDoc ,arrayUnion,arrayRemove,query,where,getDocs,updateDoc} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

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
  const firebaseApp=initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);

  document.getElementById("searchForm").addEventListener("click", async (e) => {
    e.preventDefault();
    let text = document.getElementById("search").value;
    await retrieveData(text); // Wait for data retrieval to complete
    console.log(text);
    let sr = searchResults;
    showSearchResults(sr);
    searchResults = [];
  });
  
  let searchResults = [];
  
  let retrieveData = async (text) => {
    try {
      console.log(text);
      // const q1 = query(collection(db, "clubs"), where("Sport", "==", text));
      // const q2 = query(collection(db, "clubs"), where("clubName","==",text));//,
      const q1 = query(collection(db, "clubs"), where("Sport", ">=", text), where("Sport", "<=", text + "\uf8ff"));
      const q2 = query(collection(db, "clubs"), where("clubName", ">=", text), where("clubName", "<=", text + "\uf8ff"));
//    ) (where("Sport", "==", text), where("clubName","==",""));
      const querySnapshot1 = await getDocs(q1);

      querySnapshot1.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        searchResults.push(doc.data()); // Push data directly, no need for JSON.stringify
      });
      const querySnapshot2 = await getDocs(q2);

      querySnapshot2.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        searchResults.push(doc.data()); // Push data directly, no need for JSON.stringify
      });
      console.log("searchResults Array", searchResults);
    } catch (err) {
      console.log(err);
    }
  };
  
  const showSearchResults = (res) => {
    console.log("in showSearchResults", res);
    let rest = document.getElementById("result");
    
    if (res.length > 0) {
        let htmlcontent=``;    
        res.forEach((ele)=>{
            htmlcontent +=`<div>
            <img src="${ele.image}"><p>Category: ${ele.Sport}</p><p>Club Name: ${ele.clubName}</p><p>Location: ${JSON.stringify(ele.clubDetails)}</p><p>Members</p>
            </div>`; 
        })
        console.log(htmlcontent);
        rest.innerHTML=htmlcontent;
          } else {
      rest.innerHTML = "No results found";
    }
  };
  document.getElementById("search").addEventListener("input", async (e) => {
    let searchText = e.target.value.trim();
    if (searchText === "") {
        // Clear suggestions if the search input is empty
        showSearchResults([]);
    } else {
        await retrieveData(searchText); // Wait for data retrieval to complete
        showSearchResults(searchResults);
    }
});
document.getElementById("search").addEventListener("input", async (e) => {
  let searchText = e.target.value.trim();
  if (searchText === "") {
      clearSuggestions();
  } else {
      await retrieveData(searchText);
      displaySuggestions(searchResults);
  }
});
// Function to handle selection from dropdown
document.getElementById("suggestions").addEventListener("click", (e) => {
  if (e.target && e.target.nodeName == "A") {
      let selectedText = e.target.textContent;
      document.getElementById("search").value = selectedText;
      clearSuggestions(); // Clear dropdown suggestions
  }
});
const displaySuggestions = (res) => {
  let suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = ""; // Clear previous suggestions

  if (res.length > 0) {
      res.forEach((club) => {
          let listItem = document.createElement("li");
          listItem.innerHTML = `<a class="dropdown-item">${club.clubName}</a>`;
          suggestionsList.appendChild(listItem);
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
};
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission
  let searchText = document.getElementById("search").value.trim();
  if (searchText !== "") {
    // window.location.href = "/search-results.html?query=" + searchText; // Redirect to search results page with query parameter
    // Retrieve search results based on the search text
    await retrieveData(searchText);

    // Store search results in localStorage to pass to the next page
    localStorage.setItem("searchResults", JSON.stringify(searchResults));

    // Redirect to the search results page
    window.location.href = "/search-results.html";
  }
});


// In the search results page (search-results.html)
document.addEventListener("DOMContentLoaded", async function() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");
  if (query) {
      await retrieveData(query); // Fetch search results based on query parameter
      showSearchResults(searchResults); // Render search results on the page
  }
});

  
//   document.getElementById("submit").addEventListener("click",(e)=>{
//     e.preventDefault();
//     let text=document.getElementById("search").value;
//     retrieveData(text);
//     console.log(text);
//     let sr=searchResults;
//     console.log(searchResults);
//     showSearchResults(sr);  
//     // searchResults=[];
//   })

//   let searchResults=[];
//   let retrieveData=async(text)=>{
//     try{
//         const q = query(collection(db, "clubs"), where("Sport", "==", text));

//         const querySnapshot = await getDocs(q);
//         querySnapshot.forEach((doc) => {
//             // doc.data() is never undefined for query doc snapshots
//             console.log(doc.id, " => ", doc.data());
//             searchResults.push(JSON.stringify(doc.data()));
//             console.log("searchResults Array"+searchResults);
//             });
            
//     }catch(err){
//         console.log(err);
//     }
//   }
//   const showSearchResults=(res)=>{
//     console.log("in showSearchResults",res)
//     let rest=document.getElementById("result");
//     rest.innerHTML=`<img src="#"><p>Category: ${res.Sport}</p><p>Club Name: ${res.clubName}</p><p>Location: ${res.clubDetails}</p><p>Members</p>`
//   }
  