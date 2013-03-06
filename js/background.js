init();

function init() {
	if (!localStorage.updateInterval) {
		localStorage.updateInterval = 1;
	}
}