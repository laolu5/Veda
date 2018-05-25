// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

var page = document.getElementsByClassName("lessonPage");
var pageNum = 0;

function lesson(){
	pageNum = 0;
}

function next(){
	page[pageNum].style.width = "0%";	
	pageNum ++;
	page[pageNum].style.width = "90%";
	quiz();
}

function previous(){
	page[pageNum].style.width = "0%";	
	pageNum --;
	page[pageNum].style.width = "90%";
	quiz();
}

var num = 0;

function quiz(){
	num = Math.floor((Math.random()*39)+10);
	var Q = document.getElementById("question");
	Q.innerHTML = num + " X 11";
}

function check(){
	var ans = document.getElementById("ans1");
	if(ans.value != ""){
		if(ans.value == num*11){
			alert("Well done")
			next();
		}
		else{
			alert("Try again")
			ans.value = "";
			quiz();
		}
	}
}

var timer = 3;
var match;


function startGame(){
	var start = setInterval(countDown, 1000);
	function countDown(){
		var count = document.getElementById("countDown");
		count.innerHTML = timer;
		timer = timer - 1;
		if(timer == -1){
			clearInterval(start);
			window.location.replace("game.html")
			num = 23;
		}
	}
	match = setInterval(function(){opp()}, 5000);
}

var score = 10;
var oppScore = 10;
num = 23;

function submit(){
	var Q = document.getElementById("gameQ");
	var ans = document.getElementById("gameAns");
	var you = document.getElementById("you");
	if(ans.value != ""){
		if(ans.value == num*11){
			num = Math.floor((Math.random()*39)+10);
			Q.innerHTML = num + " X 11";
			score = score + 10;
			you.style.width = score + "%";
			ans.value = "";
			if(score == 100){
				alert("You win!")
				window.location.replace("index.html")
			}
		}
		else{
			num = Math.floor((Math.random()*39)+10);
			Q.innerHTML = num + " X 11";
			ans.value = "";
		}
	}
}


function stop(){
	clearInterval(match);
}

var opp = document.getElementById("opp");


function opp(){
		oppScore = oppScore + 10;
		opp.style.width = oppScore + "%";
		if(oppScore >= 100){
			alert("Sorry, you lost");
			clearInterval(match);
			stop();
			window.location.replace("index.html")
		}
}

/*
// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})
*/

// Init Messages
var messages = app.messages.create({
  el: '.messages',

  // First message rule
  firstMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
    /* if:
      - there is no previous message
      - or previous message type (send/received) is different
      - or previous message sender name is different
    */
    if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
    return false;
  },
  // Last message rule
  lastMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
    /* if:
      - there is no next message
      - or next message type (send/received) is different
      - or next message sender name is different
    */
    if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
    return false;
  },
  // Last message rule
  tailMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
      /* if (bascially same as lastMessageRule):
      - there is no next message
      - or next message type (send/received) is different
      - or next message sender name is different
    */
    if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
    return false;
  }
});

// Init Messagebar
var messagebar = app.messagebar.create({
  el: '.messagebar'
});

// Response flag
var responseInProgress = false;

// Send Message
$$('.send-link').on('click', function () {
  var text = messagebar.getValue().replace(/\n/g, '<br>').trim();
  // return if empty message
  if (!text.length) return;

  // Clear area
  messagebar.clear();

  // Return focus to area
  messagebar.focus();

  // Add message to messages
  messages.addMessage({
    text: text,
  });

  if (responseInProgress) return;
  // Receive dummy message
  receiveMessage();
});

// Dummy response
var answers = [
  'Yes!',
  'No',
  'Hm...',
  'I am not sure',
  'And what about you?',
  'May be ;)',
  'Lorem ipsum dolor sit amet, consectetur',
  'What?',
  'Are you sure?',
  'Of course',
  'Need to think about it',
  'Amazing!!!'
]
var people = [
  {
    name: 'Kate Johnson',
    avatar: 'http://lorempixel.com/100/100/people/9'
  },
  {
    name: 'Blue Ninja',
    avatar: 'http://lorempixel.com/100/100/people/7'
  }
];
function receiveMessage() {
  responseInProgress = true;
  setTimeout(function () {
    // Get random answer and random person
    var answer = answers[Math.floor(Math.random() * answers.length)];
    var person = people[Math.floor(Math.random() * people.length)];

    // Show typing indicator
    messages.showTyping({
      header: person.name + ' is typing',
      avatar: person.avatar
    });

    setTimeout(function () {
      // Add received dummy message
      messages.addMessage({
        text: answer,
        type: 'received',
        name: person.name,
        avatar: person.avatar
      });
      // Hide typing indicator
      messages.hideTyping();
      responseInProgress = false;
    }, 4000);
  }, 1000);
}