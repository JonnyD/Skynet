var onlinePlayers = [];
var stats = [];

init();

function init() {
	if (!localStorage.updateInterval) {
		localStorage.updateInterval = 1;
	}
	
	fetchOnlinePlayers();
	fetchStats();
}

function HTTPRequest() {
	var xmlHttp;
	// Create xmlHttp Object
	try {
		// Firefox, Opera 8.0+, Safari
		xmlHttp = new XMLHttpRequest();
	} catch (e) {
		try {
			// Internet Explorer
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				console.log("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	return xmlHttp;
}

function fetchOnlinePlayers() {
	var xmlHttp = HTTPRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			var response = xmlHttp.responseText;
			parseOnlinePlayers(response);
		}
	};
	var url = "http://skynet.nickg.org/online.json";
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);

	setTimeout(fetchOnlinePlayers, 1000 * localStorage.updateInterval);
}

function parseOnlinePlayers(data) {
	var items = JSON.parse(data);

	onlinePlayers = [];

	var username;
	var timestamp;
	var player;

	var count = 0;
	for ( var key in items) {
		username = key;
		timestamp = items[key];

		player = {
			username : username,
			loggedIn : timestamp
		};

		onlinePlayers[count] = player;

		count++;
	}
}

function fetchStats() {
	var xmlHttp = HTTPRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			var response = xmlHttp.responseText;
			parseStats(response);
		}
	};
	var url = "http://skynet.nickg.org//stats.json?at=now";
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

function parseStats(data) {
    stats = JSON.parse(data);
}