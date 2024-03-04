let clubDetails = [];
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getFirestore,
  collection,
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
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore database service
const db = getFirestore(app);

// Function to fetch club data from Firebase
async function getClubMapData() {
  try {
    const clubsCollectionRef = collection(db, "clubs");
    const querySnapshot = await getDocs(clubsCollectionRef);

    const clubData = [];
    querySnapshot.forEach((doc) => {
      // Extract data from each document
      const club = doc.data();
      const clubId = doc.id; // Accessing the unique ID of the document
      // Add additional processing here if needed
      clubData.push({ id: clubId, ...club });
    });

    // Return the array of club data
    return clubData;
  } catch (error) {
    console.error("Error fetching club data:", error);
    // Handle the error appropriately
    return [];
  }
}
//  Add other markers here
getClubMapData()
  .then((clubData) => {
    clubDetails = clubData;
    // Process the retrieved club data here
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const apiKey = "AIzaSyCNnCpF2ku_EhRvDgix0AdgEtWN-aK0wMU";


window.initMap = async function () {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    styles: [
      {
        elementType: "geometry",
        stylers: [
          {
            color: "#FCC577",
          },
        ],
      },
      {
        featureType: "administrative.country",
        elementType: "geometry.stroke",
        stylers: [
          { color: "#C626B8" }, // Country border color
        ],
      },

      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#FF8D75", // Set road color to green
          },
        ],
      },
      {
        featureType: "landscape.natural",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#FCD1AC", // Set color of forests
          },
        ],
      },

      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "9bbff4", // Set water color to green
          },
        ],
      },

      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#ffffff", // Set text color to white
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffffff", // Change color here
          },
        ],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#000000", // Set text stroke color to black
          },
        ],
      },
    ],
  });
  // marker with customized color
  // const marker = new google.maps.Marker({
  //   position: {
  //     lat: position.clubDetails.latitude,
  //     lng: position.clubDetails.longitude,
  //   }, // Marker position
  //   map: map, // Map object to display the marker
  //   title: location.clubName, // Marker title (optional)
  //   icon: {
  //     path: google.maps.SymbolPath.CIRCLE, // Shape of the marker
  //     fillColor: "#FF0000", // Color of the marker (e.g., red)
  //     fillOpacity: 0.8, // Opacity of the marker
  //     strokeWeight: 0, // Stroke weight (outline thickness)
  //     scale: 10, // Size of the marker
  //   },
  // });

  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(center);

        const userMarker = new google.maps.Marker({
          position: center,
          map: map,
          title: "Your Location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#4285f4",
            fillOpacity: 0.8,
            strokeWeight: 0,
            scale: 10, // Adjust the size of the circle as needed
          },
        });

        const val = await getClubMapData();
        // Add other markers here
        if (val) {
          val.forEach((location) => {
            console.log(location);

const marker =  addMarker(location.Sport, {
              lat: location.clubDetails.lat,
              lng: location.clubDetails.long,
            }, location.clubName, map) ;

            // const marker = new google.maps.Marker({
            //   position: {
            //     lat: location.clubDetails.lat,
            //     lng: location.clubDetails.long,
            //   },
            //   map: map,
            //   title: location.clubName,
            // });
            // <img src="../kartavya/test.jpeg" alt="${location.title}" style="width: 100%;height:100px">

            const contentString = `
              <div style="width:200px"  id="infoWindowContent">
              <img src="${location?.addressOfImage}" alt="${location.title}" style="width: 100%;height:100px" onerror="this.onerror=null; this.src='../kartavya/test.jpeg';">
              <div style="font-size:1rem;font-weight:400">${location.clubName}</div>
                <p>${location.clubDescription}</p>
                <a href="./club_details.html?id=${location.id}">View Details</a>
              </div>
            `;

            const infowindow = new google.maps.InfoWindow({
              content: contentString,
              pixelOffset: new google.maps.Size(0, 10), // Adjust the offset as needed
            });
            const inWindow = document.getElementById("infoWindowContent");
            marker.addListener("mouseover", function () {
              infowindow.open(map, marker);
            });

            google.maps.event.addListener(infowindow, "domready", function () {
              const infoWindowContent =
                document.getElementById("infoWindowContent");

              // Mouseover event listener for content
              infoWindowContent.addEventListener("mouseover", function () {
                infowindow.open(map, marker);
              });

              // Mouseout event listener for content
              infoWindowContent.addEventListener("mouseout", function () {
                // Delay closing the infowindow to prevent it from closing when moving between marker and content
                setTimeout(function () {
                  if (!infoWindowContent.matches(":hover")) {
                    infowindow.close();
                  }
                }, 300); // Adjust the delay as needed
              });
            });
          });
        }
      },
      function () {
        handleLocationError(true, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
};

function handleLocationError(browserHasGeolocation, pos) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: pos,
  });

  const content = browserHasGeolocation
    ? "Error: The Geolocation service failed."
    : "Error: Your browser doesn't support geolocation.";

  const infowindow = new google.maps.InfoWindow({
    content: content,
  });

  const marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: "Error",
  });

  marker.addListener("mouseover", function () {
    infowindow.open(map, marker);
  });

  marker.addListener("mouseout", function () {
    infowindow.close();
  });
}

function loadScript() {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  script.defer = true;
  document.head.appendChild(script);
}

window.onload = loadScript;


function addMarker(category, position, title,map) {
  
  var icon = category === 'Cricket' ? 'https://banner2.cleanpng.com/20190627/zox/kisspng-cricket-bats-bat-and-ball-games-batting-cricket-ba-5d157f9ba10995.3232231815616900116596.jpg' 
  : 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsb2ZmaWNlNF9waG90b19vZl9hX2FtZXJpY2FuX2Zvb3RiYWxsX2JhbGxfaXNvbGF0ZWRfb25fd19iOTZjODYyMy0yZDRkLTQ0ZjQtOWNkYi1lNjEzNTJjYzM3NzgucG5n.png';
  var size = new google.maps.Size(50, 50);

  var marker = new google.maps.Marker({
    position: position,
    map: map,
    icon: {
      url: icon,
      scaledSize: size
    },
    title: title
  });
  return marker;
}