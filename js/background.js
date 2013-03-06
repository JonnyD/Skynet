init();

function init() {
	if (!localStorage.updateInterval) {
		localStorage.updateInterval = 1;
	}
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
