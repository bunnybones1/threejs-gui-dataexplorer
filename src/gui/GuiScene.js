var ResizeManager = require('input-resize');
var getBoundingBoxOfChildren = require('threejs-getboundingboxofchildren');
var onResizeSignal = ResizeManager.onResize;
var InteractivityManager = require('../interactivity');

var origin = new THREE.Vector3();
var adjustWidth = false;
var NONE = 0;
var FIT = 1;
var CROP = 2;
var fitMode = NONE;

function GUIScene (renderer, guiCamera) {
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

	this.interactivity = new InteractivityManager(this.camera, this);

	var _this = this;
	var oldAdd = this.add.bind(this);
	this.add = function(object, interactive) {
		if(interactive) _this.interactivity.addObject(object);
		oldAdd(object);
	}

	this.focusChildren = [];
}

GUIScene.prototype = Object.create(THREE.Scene.prototype);

GUIScene.prototype.resize = function(width, height) {
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

GUIScene.prototype.centerOn = function (obj) {
	var boundingBox;
	var objGlobalPos;
	if(obj instanceof Array) {
		boundingBox = new THREE.Box3();
		for (var i = 0; i < obj.length; i++) {
			var bb = getBoundingBoxOfChildren(obj[i]);
			boundingBox.union(bb);
		};
	} else {
		boundingBox = getBoundingBoxOfChildren(obj);
	}

	var bbCenter = boundingBox.min.clone().add(boundingBox.max).multiplyScalar(.5);
	var bbSize = boundingBox.size();
	var bbAspect = bbSize.y / bbSize.x;
	var aspectRatio = bbAspect / ResizeManager.aspect;
	var aspectScreen = ResizeManager.aspect;
	var dominantAxis;
	var submissiveAxis;
	if(aspectRatio > 1) {
		dominantAxis = 'x';
		submissiveAxis = 'y';
	} else if (aspectRatio < 1) {
		dominantAxis = 'y';
		submissiveAxis = 'x';
		aspectScreen = 1 / aspectScreen;
	}

	if(dominantAxis) {
		if(fitMode === FIT) {
			boundingBox.min[dominantAxis] = bbCenter[dominantAxis] + (bbSize[submissiveAxis] / aspectScreen) * -.5;
			boundingBox.max[dominantAxis] = bbCenter[dominantAxis] + (bbSize[submissiveAxis] / aspectScreen) * .5;
		} else if(fitMode === CROP) {
			boundingBox.min[submissiveAxis] = bbCenter[submissiveAxis] + (bbSize[dominantAxis] * aspectScreen) * -.5;
			boundingBox.max[submissiveAxis] = bbCenter[submissiveAxis] + (bbSize[dominantAxis] * aspectScreen) * .5;			
		}
	}

	this.camera.left = boundingBox.min.x;
	this.camera.right = boundingBox.max.x;
	this.camera.top = boundingBox.max.y;
	this.camera.bottom = boundingBox.min.y;

	this.camera.updateProjectionMatrix();
}

module.exports = GUIScene;