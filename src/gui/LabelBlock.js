var _ = require('lodash');

var Label = require('threejs-label').label;

function LabelBlock(properties) {
	properties = _.assign({
		text: 'label',
		top: 10,
		bottom : -10,
		left: -10,
		right: 10,
		color: 0xffffff,
		opacity: .2
	}, properties || {});

	if(!properties.material) {
		properties.material = new THREE.MeshBasicMaterial({
			color: properties.color,
			emissive: properties.color,
			lights: false,
			fog: false,
			transparent: true,
			opacity: properties.opacity
		});
	}


	this.top = properties.top;
	this.bottom = properties.bottom;
	this.left = properties.left;
	this.right = properties.right;

	var geom = new THREE.PlaneGeometry(1, 1);

	THREE.Mesh.call(this, geom, properties.material);

	this.name = 'LabelBlock: ' + properties.text;

	this.label = new Label(properties);
	this.add(this.label);

	this.setPositionByEdges();
}

LabelBlock.prototype = Object.create(THREE.Mesh.prototype);

LabelBlock.prototype.setPositionByEdges = function() {
	this.position.x = (this.left + this.right) * .5;
	this.position.y = (this.top + this.bottom) * .5;
	this.scale.x = (this.right - this.left);
	this.scale.y = (this.top - this.bottom);

	var labelBoundingBox = this.label.geometry.boundingBox;
	var labelSize = labelBoundingBox.size();
	this.label.scale.x = 1 / labelSize.x;
	this.label.scale.y = 1 / labelSize.y;
	this.label.position.x = -labelBoundingBox.min.x / labelSize.x - 0.5;
	this.label.position.y = -labelBoundingBox.min.y / labelSize.y - 0.5;
}

module.exports = LabelBlock;