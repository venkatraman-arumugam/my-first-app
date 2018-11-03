var click = true;
var JSON_ARRAY = [];
var JSON_FU = {};
var old_length = "";
old_length = JSON_ARRAY.length;
function addTask(id,title,content) {
	// body...
	if(click){
		click = false;
		var task = document.getElementById("tasks");
		var div = document.createElement("div");
		var i = document.createElement("i");
		div.id = id;
		i.className = "fa";
		i.className +=" fa-remove";
		i.className +=" remove";
		i.setAttribute("aria-hidden","true");
		i.setAttribute("onclick","remove(this)");
		var h4 = document.createElement("h4");
		var p = document.createElement("p");
		p.appendChild(document.createTextNode(content));
		h4.appendChild(document.createTextNode(title));
		div.className += "notes";
		div.appendChild(i);
		div.appendChild(h4);
		div.appendChild(p);
		task.appendChild(div);
		setTimeout(function(){
                click = true;
        }, 3000);
	}
}

var removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
	console.log(arr[i].hasOwnProperty(attr));
       if( arr[i] && arr[i].hasOwnProperty(attr) && (arr[i][attr] === value ) ){ 
       	console.log(arr[i][attr]);
       		arr.splice(i,1);
       }
    }
    return arr;
}


function modal_input() {
	// body...
	var title = document.getElementById("title").value;
	var content = document.getElementById("content").textContent;
	var task = document.getElementById("tasks");
	var children = task.children;
	var id = "";
	if(children.length!=0){
		id = parseInt(children[children.length-1].id.substring(1))+1;
	}else{
		id = "1";
	}
	id = "n"+id;
	addTask(id,title,content);
	var temp = generate_JSON(id,title,content);
	JSON_ARRAY.push(temp);
	var js = JSON.stringify(JSON_ARRAY);
	JSON_FU["data"] = JSON_ARRAY;
	saveChanges(JSON_FU,false);
	document.getElementById("content").textContent = "";
	document.getElementById("title").value = "";
}
function remove(element){
	console.log(element.parentNode.id);
	var parent = document.getElementById(element.parentNode.id);
	console.log(element.parentNode.id);
	parent.remove();
	console.log(JSON_ARRAY);
	JSON_ARRAY = removeByAttr(JSON_ARRAY,'id',element.parentNode.id);
	JSON_FU["data"] = JSON_ARRAY;
	saveChanges(JSON_FU,false);
}



function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function generate_JSON(id,title,content) {
	// body...
	var obj = {};
	obj["id"] = id;
	obj["title"] = title;
	obj["content"] = content;
	return obj;
}

function saveChanges (json,status) {
	console.log(old_length+" "+JSON_ARRAY.length);
    if(JSON_ARRAY.length > old_length || JSON_ARRAY.length < old_length){
    	var user = localStorage.getItem("user");
    	localStorage.clear();
    	if(!status){
    		put_data();
    	}
    	localStorage.setItem("todo_tasks", JSON.stringify(json));
    	localStorage.setItem("user",user);
	    console.log("changes saved successfully !");
	    window.onbeforeunload = null;
	    old_length = JSON_ARRAY.length;
    }
}

function exitConfirmation () {
	JSON_FU["data"] = JSON_ARRAY;
    setTimeout( saveChanges(JSON_FU), 0 );
    put_data();
    get_data();
   // return "There are unsaved changes on this canvas, all your changes will be lost if you exit !";
}



function interval(){
	setInterval( function(){
		exitConfirmation ();
	}, 2000 );
}

//interval();


window.onload = function (){
	//console.log(localStorage.getItem("todo_tasks"));
	if(localStorage.getItem("todo_tasks") === null){
		get_data();
	}else{
		var parse = JSON.parse(localStorage.getItem("todo_tasks"));
		var array = parse["data"];
		for (var i = 0; i < array.length; i++) {
			click = true;
			addTask(array[i].id,array[i].title,array[i].content);
			JSON_ARRAY.push(array[i]);
		}
		old_length = array.length;
	}
}


// Initialize Firebase
var config = {
	apiKey: "AIzaSyDFZqx5Y27ms-ETg3cquc9-yEFElIwBi-g",
	authDomain: "todo-app-9581c.firebaseapp.com",
	databaseURL: "https://todo-app-9581c.firebaseio.com",
	storageBucket: "",
	messagingSenderId: "563141190234"
};
firebase.initializeApp(config);
var base_name = localStorage.getItem("user");
var myFirebaseRef = new Firebase("https://todo-app-9581c.firebaseio.com/venkatramcool001");

function put_data(){
	myFirebaseRef.set({
		JSON_FU
	}).then(function() {
		var obj = {};
		if(hostReachable()){
			obj["status"] = true;
		}else{
			obj["status"] = false;
		}
		JSON_ARRAY.push(obj);
	})
}

function get_data(){
	console.log(base_name);
	var query = firebase.database().ref("venkatramcool001");
	query.once("value").then(function(snapshot) {
	  	console.log(snapshot.val());
	  	var value = snapshot.val()["JSON_FU"];
	  	var arr = value["data"];
	  	for(var i = 0;i<arr.length;i++){
	  		addTask(arr[i].id,arr[i].title,arr[i].content);
	  		click = true;
	  		JSON_ARRAY.push(arr[i]);
	  	}
	}).then(function (){
		JSON_FU["data"] = JSON_ARRAY;
		saveChanges(JSON_FU,true);
	}).catch(function (){
		console.log("Error");
	});
}


function hostReachable() {

  // Handle IE and more capable browsers
  var xhr = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );
  var status;

  // Open new request as a HEAD to the root hostname with a random param to bust the cache
  xhr.open( "HEAD", "//" + window.location.hostname + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false );

  // Issue request and handle response
  try {
    xhr.send();
    return ( xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304) );
  } catch (error) {
    return false;
  }

}
