const debug = (...args) => { console.log(...args); };
const SERVER_URI = `http://localhost:5000`;

window.notifier = new AWN({
	durations: {
		alert: 2000
	},
	position: 'top-right'
});