var onlinePlayers = [];
var background = chrome.extension.getBackgroundPage();
onlinePlayers = background.onlinePlayers.sort(compareByTimestamp);

var currentDate = new Date();
var nowUTC = currentDate.getTime() + currentDate.getTimezoneOffset()*60*1000;

var content = document.getElementById("content");
var onlinePlayersView = document.createElement("div");
onlinePlayersView.setAttribute("class", "onlinePlayers");
content.appendChild(onlinePlayersView);

document.write("Online players: " + onlinePlayers.length);
var count = 1;
for ( var i in onlinePlayers) {
	var player = onlinePlayers[i];

	var detail = document.createElement("div");
	detail.setAttribute("class", "onlinePlayer");
	var usernameNode = document
			.createTextNode(count + " " + player["username"] + " (" + timeDifference(nowUTC, player["loggedIn"]) + ") ");
	detail.appendChild(usernameNode);

	onlinePlayersView.appendChild(detail);
	count++;
}

function compareByUsername(player1, player2) {
	var player1Username = player1.username.toLowerCase();
	var player2Username = player2.username.toLowerCase();
	
	if (player1Username < player2Username) {
		return -1;
	}
	if (player1Username > player2Username) {
		return 1;
	}
	
	return 0;
}

function compareByTimestamp(player1, player2) {
	var player1Timestamp = player1.loggedIn;
	var player2Timestamp = player2.loggedIn;
	
	if(player1Timestamp < player2Timestamp) {
		return -1;
	}
	if(player1Timestamp > player2Timestamp) {
		return 1;
	}
	
	return 0;
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours';   
    }
}