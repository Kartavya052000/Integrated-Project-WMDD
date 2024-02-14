

let clubDetails=[]
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
    import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
    
    // Your Firebase configuration
         const firebaseConfig = {
            apiKey: "AIzaSyC3L-pygyvZqYOGp5Os7swV54Mhno1To88",
            authDomain: "test-8e125.firebaseapp.com",
            databaseURL: "https://test-8e125-default-rtdb.firebaseio.com",
            projectId: "test-8e125",
            storageBucket: "test-8e125.appspot.com",
            messagingSenderId: "675271753145",
            appId: "1:675271753145:web:0f2070f6b149b210608a68",
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
          // Add additional processing here if needed
          clubData.push(club);
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
         getClubMapData().then((clubData) => {
      // console.log("Club data:", clubData);
        clubDetails=clubData

      
      // Process the retrieved club data here
    }).catch((error) => {
      console.error("Error:", error);
    });
 
        // import { clubDetails } from './module-script.js';
// 
// console.log(clubDetails,"AAA");
    // const apiKey = 'YOUR_API_KEY';
    const apiKey = 'AIzaSyCNnCpF2ku_EhRvDgix0AdgEtWN-aK0wMU';


    window.initMap = async function () {
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
      });

      // Try HTML5 geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) { 
          const center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(center);

          const userMarker = new google.maps.Marker({
            position: center,
            map: map,
            title: 'Your Location',
            icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#4285f4',
          fillOpacity: 0.8,
          strokeWeight: 0,
          scale: 10 // Adjust the size of the circle as needed
        }
          });

          // const infowindow = new google.maps.InfoWindow({
          //   content: 'You are here'
          // });

          // userMarker.addListener('mouseover', function() {
          //   infowindow.open(map, userMarker);
          // });

          // userMarker.addListener('mouseout', function() {
          //   infowindow.close();
          // });
        const val = await getClubMapData()
          // console.log(val,"CCCLLLL")
          // Add other markers here
          if(val){
          // console.log(val,"CCCLLLL22 2")

            const clubLocations = [
            { position: { lat: 49.223574, lng: -123.085842 }, title: 'Club A', detailsUrl: 'club-a-details.html', image: 'club-a-image.jpg', details: 'Club A details' },
            { position: { lat: 49.228003, lng: -123.098764 }, title: 'Club B', detailsUrl: 'club-b-details.html', image: 'club-b-image.jpg', details: 'Club B details' },
            // Add more club locations as needed
          ];

          val.forEach(location => {
            const marker = new google.maps.Marker({
              position: {
                lat:location.data.clubDetails.lat,
                lng:location.data.clubDetails.long,
              },
              map: map,
              title: location.data.clubName
            });

            const contentString = `
              <div style="width:200px"  id="infoWindowContent">
              <img src="../kartavya/test.jpeg" alt="${location.title}" style="width: 100%;height:100px">
              <div style="font-size:1rem;font-weight:400">${location.data.clubName}</div>
                <p>${location.data.clubDescription}</p>
                <a href="${location.detailsUrl}">View Details</a>
              </div>
            `;

            const infowindow = new google.maps.InfoWindow({
              content: contentString,
              pixelOffset: new google.maps.Size(0, 10) // Adjust the offset as needed

            });
const inWindow = document.getElementById("infoWindowContent")
            marker.addListener('mouseover', function() {
              infowindow.open(map, marker);
            });

            google.maps.event.addListener(infowindow, 'domready', function() {
              const infoWindowContent = document.getElementById('infoWindowContent');
      
              // Mouseover event listener for content
              infoWindowContent.addEventListener('mouseover', function() {
                  infowindow.open(map, marker);
              });
      
              // Mouseout event listener for content
              infoWindowContent.addEventListener('mouseout', function() {
                  // Delay closing the infowindow to prevent it from closing when moving between marker and content
                  setTimeout(function() {
                      if (!infoWindowContent.matches(':hover')) {
                          infowindow.close();
                      }
                  }, 300); // Adjust the delay as needed
              });
          }); 
            // marker.addListener('mouseout', function() {
            //   infowindow.close();
            // });
          });
          }
        

        }, function() {
          handleLocationError(true, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
      }
    }

    function handleLocationError(browserHasGeolocation, pos) {
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: pos
      });

      const content = browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.';

      const infowindow = new google.maps.InfoWindow({
        content: content
      });

      const marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Error'
      });

      marker.addListener('mouseover', function() {
        infowindow.open(map, marker);
      });

      marker.addListener('mouseout', function() {
        infowindow.close();
      });
    }

    function loadScript() {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.defer = true;
      document.head.appendChild(script);
    }

    window.onload = loadScript;
