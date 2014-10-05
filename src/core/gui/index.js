var onResizeSignal = require('../view/ResizeManager').onResizeSignal;

var adjustWidth = false;

function GUI (renderer, guiCamera) {
	THREE.Scene.call(this);
	this.camera = guiCamera || new THREE.OrthographicCamera(-10, 10, 10, -10, -1000, 1000);
	var oldRender = renderer.render.bind(renderer);
	var _this = this;
	renderer.autoClear = false;
	renderer.clear();
	renderer.render = function(scene, camera, renderTarget, forceClear) {
		oldRender(scene, camera, renderTarget, forceClear);
		oldRender(_this, guiCamera, renderTarget, false);
	}

	this.resize = this.resize.bind(this);
	onResizeSignal.add(this.resize);
	this.resize(window.innerWidth, window.innerHeight);
}

GUI.prototype = Object.create(THREE.Scene.prototype);

GUI.prototype.resize = function(width, height) {
	var aspect = adjustWidth ? width/height : height/width;
	if(adjustWidth) {
		this.camera.left = this.camera.bottom * aspect;
		this.camera.right = this.camera.top * aspect;
	} else {
		this.camera.bottom = this.camera.left * aspect;
		this.camera.top = this.camera.right * aspect;
	}
	this.camera.updateProjectionMatrix();
}

module.exports = GUI;