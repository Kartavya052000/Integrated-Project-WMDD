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
    // styles: [
    //   {
    //     elementType: "geometry",
    //     stylers: [
    //       {
    //         color: "#FCC577",
    //       },
    //     ],
    //   },
    //   {
    //     featureType: "administrative.country",
    //     elementType: "geometry.stroke",
    //     stylers: [
    //       { color: "#C626B8" }, // Country border color
    //     ],
    //   },

    //   {
    //     featureType: "road",
    //     elementType: "geometry",
    //     stylers: [
    //       {
    //         color: "#FF8D75", // Set road color to green
    //       },
    //     ],
    //   },
    //   {
    //     featureType: "landscape.natural",
    //     elementType: "geometry.fill",
    //     stylers: [
    //       {
    //         color: "#FCD1AC", // Set color of forests
    //       },
    //     ],
    //   },

    //   {
    //     featureType: "water",
    //     elementType: "geometry",
    //     stylers: [
    //       {
    //         color: "9bbff4", // Set water color to green
    //       },
    //     ],
    //   },

    //   {
    //     elementType: "labels.text.fill",
    //     stylers: [
    //       {
    //         color: "#ffffff", // Set text color to white
    //       },
    //     ],
    //   },
    //   {
    //     featureType: "administrative",
    //     elementType: "geometry.fill",
    //     stylers: [
    //       {
    //         color: "#ffffff", // Change color here
    //       },
    //     ],
    //   },
    //   {
    //     elementType: "labels.text.stroke",
    //     stylers: [
    //       {
    //         color: "#000000", // Set text stroke color to black
    //       },
    //     ],
    //   },
    // ],
    styles: [
      {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#202c3e"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "gamma": 0.01
          },
          {
            "lightness": 20
          },
          {
            "weight": "1.39"
          },
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "weight": "0.96"
          },
          {
            "saturation": "9"
          },
          {
            "visibility": "on"
          },
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "lightness": 30
          },
          {
            "saturation": "9"
          },
          {
            "color": "#29446b"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "saturation": 20
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "lightness": 20
          },
          {
            "saturation": -20
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "lightness": 10
          },
          {
            "saturation": -30
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#193a55"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "saturation": 25
          },
          {
            "lightness": 25
          },
          {
            "weight": "0.01"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "lightness": -20
          }
        ]
      }
    ]
  });


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
            // console.log(location);

            const marker = addMarker(location.Sport, {
              lat: location.clubDetails.lat,
              lng: location.clubDetails.long,
            }, location.clubName, map);

            const contentString = `
            <div
            style="
              width: 200px;
              background-color: #7bdd4c;
              padding: 6px;
              border-radius: 14px;
              display: flex;
            "
            id="infoWindowContent"
          >
            <img
              src="${location?.addressOfImage}"
              alt="${location.title}"
              style="border-radius: 14px; width: 75px; height: 70px"
              onerror="this.onerror=null; this.src='../kartavya/test.jpeg';"
            />
  
            <div style="margin: 0 10px">
              <p
                style="
                  font-size: 1rem;
                  color: black;
                  margin: 0;
                  text-transform: capitalize;
                "
              >
                ${location.clubName}
              </p>
              <p
                style="
                  color: black;
                  font-size: 12px;
                  margin: 0;
                  margin-bottom: 6px;
                "
              >
                ${location.Sport}
              </p>
              <p style="color: black; font-size: 12px; margin: 0">
                <i class="fa-solid fa-location-dot" style="padding-right: 5px"></i
                >${location.clubDetails.address}
              </p>
              <a
                href="./club_details.html?id=${location.id}"
                style="
                  background-color: black;
                  text-decoration: none;
                  font-size: 12px;
                  border-radius: 14px;
                  padding: 2px 10px;
                  color: green;
                "
                >View Details</a
              >
            </div>
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
            // marker.addListener("mouseout", function () {
            //   infowindow.close();

            // });


            google.maps.event.addListener(infowindow, "domready", function () {


              const infoWindowContent =
                document.getElementById("infoWindowContent");



              // Mouseout event listener for content
              // Mouseout event listener for info window
              infowindow.addListener("mouseout", function (event) {
                // Check if the mouse is outside both the marker and info window
                if (!isMouseInside(marker, event)) {
                  infowindow.close();
                }
              });

            });
            // Function to check if the mouse is inside the marker
            function isMouseInside(marker, event) {
              const bounds = marker.getBounds();
              return bounds.contains(event.toElement || event.relatedTarget);
            }
          });
        }
      },

      function (error) {
        handleLocationError(error.code === error.PERMISSION_DENIED, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
};

function handleLocationError(permissionDenied, pos) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: pos,
  });

  if (permissionDenied) {
    alert("Error: Geolocation permission denied.");
  } else {
    const content = "Error: Your browser doesn't support geolocation.";
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
}

function loadScript() {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  script.defer = true;
  document.head.appendChild(script);
}

window.onload = loadScript;

const categoryIcons = [
  { name: 'cricket', image: 'https://banner2.cleanpng.com/20190627/zox/kisspng-cricket-bats-bat-and-ball-games-batting-cricket-ba-5d157f9ba10995.3232231815616900116596.jpg' },
  { name: 'football', image: 'football.png' },
  { name: 'tennis', image: 'tennis.png' },
  // Add more sports as needed
];

function addMarker(category, position, title, map) {
  const matchingSport = categoryIcons.find(sport => sport.name === category);

  // If a match is found, get the image URL; otherwise, use a default image
  const icon = matchingSport ? matchingSport.image : 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsb2ZmaWNlNF9waG90b19vZl9hX2FtZXJpY2FuX2Zvb3RiYWxsX2JhbGxfaXNvbGF0ZWRfb25fd19iOTZjODYyMy0yZDRkLTQ0ZjQtOWNkYi1lNjEzNTJjYzM3NzgucG5n.png';

  var size = new google.maps.Size(50, 50);

  var marker = new google.maps.Marker({
    position: position,
    map: map,
    icon: {
      url: "../assests/images/icons/commonMapIcon.png",
      scaledSize: size
    },
    title: title
  });
  return marker;
}


