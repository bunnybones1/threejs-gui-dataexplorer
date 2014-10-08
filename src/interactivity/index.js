var OrthographicInteractity = require('./Orthographic');
var PerspectiveInteractity = require('./Perspective');

function hitTest(x, y) {
	throw(new Error('Interactivity not set properly.'))
}

function addObject(obj) {
	console.log('adding object', obj, this.objects);
	this.objects.push(obj);
}

function InteractivityManager(camera, scene) {
	this.camera = camera;
	this.scene = scene;
	this.objects = [];
	this.hitTest = hitTest.bind(this);
	this.addObject = addObject.bind(this);
	if(camera instanceof THREE.OrthographicCamera) {
		OrthographicInteractity.call(this);
	} else if( camera instanceof THREE.PerspectiveCamera) {
		PerspectiveInteractivity.call(this);
	}
}
module.exports = InteractivityManager;