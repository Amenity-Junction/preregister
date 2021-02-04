const debug = (...args) => { /* console.log(...args); */ };
const SERVER_URI = `https://aj-prereg.herokuapp.com`;

window.notifier = new AWN({
	durations: {
		alert: 2000
	},
	position: 'top-right'
});