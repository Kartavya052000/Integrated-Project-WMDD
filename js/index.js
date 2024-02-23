class sHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = ` <nav class="navbar bg-info navbar-expand-lg  bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">SportsCrush</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link " aria-current="page" href="index.html">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link " href="map.html">Map</a>
              </li>
              <li class="nav-item">
              <a class="nav-link" href="create_club.html">Create Club</a>
              </li>
              <li class="nav-item">
              <a class="nav-link" href="login.html">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link " href="myprofile.html">My Profile</a>
              </li>
              <li class="nav-item">
                <a class="nav-link " href="myclubs_details.html">My Clubs</a>
              </li>
              <li class="nav-item">
              <a class="nav-link " href="myprofile.html">Manage Clubs</a>
            </li>
            </ul>
            <form class="d-flex" role="search">
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>`;
  }
}

customElements.define("s-header", sHeader);
// Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyC3L-pygyvZqYOGp5Os7swV54Mhno1To88",
//   authDomain: "test-8e125.firebaseapp.com",
//   databaseURL: "https://test-8e125-default-rtdb.firebaseio.com",
//   projectId: "test-8e125",
//   storageBucket: "test-8e125.appspot.com",
//   messagingSenderId: "675271753145",
//   appId: "1:675271753145:web:0f2070f6b149b210608a68",
// };

// firebase.initializeApp(firebaseConfig); // Initialize Firebase

// // Function to create a club
// async function createClub(userId, clubName, clubDescription) {
//   try {
//     // Add club document to "clubs" collection
//     const clubRef = await firebase.firestore().collection("clubs").add({
//       name: clubName,
//       description: clubDescription,
//       admin: userId,
//     });

//     // Add user as admin in the "members" subcollection of the club
//     await clubRef.collection("members").doc(userId).set({
//       userId: userId,
//       role: "admin",
//     });

//     console.log("Club created successfully!");
//   } catch (error) {
//     console.error("Error creating club: ", error);
//   }
// }

// // Call the createClub function
// // createClub("zAuTYTmuOcgGFjI0daHLLCXjZPX2", "My Club", "Club Description");
