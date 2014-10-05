var EventUtils = require('../utils/Events');
var Signal = require('signals').Signal;
var onResizeSignal = new Signal();

EventUtils.addEvent(window, "resize", function(event) {
	onResizeSignal.dispatch(window.innerWidth, window.innerHeight);
});

module.exports = {
	onResizeSignal: onResizeSignal
}