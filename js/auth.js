var provider = new firebase.auth.FacebookAuthProvider();
var config = {
	apiKey: "AIzaSyDFZqx5Y27ms-ETg3cquc9-yEFElIwBi-g",
	authDomain: "todo-app-9581c.firebaseapp.com",
	databaseURL: "https://todo-app-9581c.firebaseio.com",
	storageBucket: "",
	messagingSenderId: "563141190234"
};
firebase.initializeApp(config);
function facebook(){
	
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  var user = result.user;
	  if(user != null){
	  	console.log(user["email"]);
	  	window.location = "todo.html";
	  	localStorage.setItem("user",user.email);
	  }
	  // ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  console.log(errorMessage);
	  var email = error.email;
	  console.log(email);
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});
}