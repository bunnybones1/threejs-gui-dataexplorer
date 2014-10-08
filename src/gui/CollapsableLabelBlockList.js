var _ = require('lodash');
var LabelBlock = require('./LabelBlock');
function CollapsableLabelBlockList(properties) {
	var LabelBlockList = require('./LabelBlockList');
	properties = _.assign({
		text: 'test',
		list: [
			'test1',
			'test2',
			'test3',
			'test4'
		],
		top: 10,
		bottom : -10,
		left: -10,
		right: 10,
		color: 0xffffff,
		opacity: .5,
	}, properties || {});

	this.top = properties.top;
	this.bottom = properties.bottom;
	this.left = properties.left;
	this.right = properties.right;

	this.width = this.right - this.left;
	this.height = this.top - this.bottom;

	THREE.Object3D.call(this);

	this.name = 'CollapsableLabelBlockList: ' + properties.text;

	this.label = new LabelBlock(properties);
	this.add(this.label);

	if(!(properties.list instanceof THREE.Object3D)) {
		properties.left += this.width;
		properties.right += this.width;
		properties.list = new LabelBlockList(properties);
	}

	this.list = properties.list;
	this.add(properties.list);

	this.setPositionByEdges();
}

CollapsableLabelBlockList.prototype = Object.create(THREE.Object3D.prototype);

CollapsableLabelBlockList.prototype.setPositionByEdges = function() {
	// this.position.x = this.left;
	// this.position.y = this.top;
	this.label.top = this.top;
	this.label.bottom = this.bottom;
	this.label.setPositionByEdges();
	this.list.top = this.top;
	this.list.bottom = this.bottom;
	this.list.setPositionByEdges();
}

module.exports = CollapsableLabelBlockList;