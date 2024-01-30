
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
    import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
    import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
  
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAGLcybmjB3QBZ5Bdk02nIkqb0F3pJKf1E",
      authDomain: "fir-sports-93164.firebaseapp.com",
      databaseURL: "https://fir-sports-93164-default-rtdb.firebaseio.com",
      projectId: "fir-sports-93164",
      storageBucket: "fir-sports-93164.appspot.com",
      messagingSenderId: "48172665362",
      appId: "1:48172665362:web:1a401f43ed83b3faaba6cb"
    };
  
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const database = getDatabase(app);

    var email=document.getElementById('email').value;
        var password=document.getElementById('password').value;

    
    // SignUp
    document.getElementById("signUp").addEventListener("click",function(){

        

        createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log("signup",user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });
});

// Login
document.getElementById("login").addEventListener("click",function(){
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("login",user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
});
 