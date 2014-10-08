var _ = require('lodash');	
var LabelBlock = require('./LabelBlock');
function LabelBlockList(properties) {
	properties = _.assign({
		list: [
			'list1',
			'list2',
			'list3'
		],
		top: 10,
		bottom : -10,
		left: -10,
		right: 10,
		color: 0xffffff,
		opacity: .5
	}, properties || {});

	this.opacity = properties.opacity;
	this.top = properties.top;
	this.bottom = properties.bottom;
	this.left = properties.left;
	this.right = properties.right;

	THREE.Object3D.call(this);

	this.name = 'LabelBlockList: ' + 'array';
	if(properties.list instanceof Array) {
		for (var i = 0; i < properties.list.length; i++) {
			this.createChild(properties.list[i], i);
		};
	} else {
		for(var key in properties.list) {
			this.createChild(properties.list[key], key);
		}
	}
	this.setPositionByEdges();
}

LabelBlockList.prototype = Object.create(THREE.Object3D.prototype);

LabelBlockList.prototype.createChild = function(item, name) {
	var CollapsableLabelBlockList = require('./CollapsableLabelBlockList');
	switch(typeof item){
		case 'string':
			var label = new LabelBlock({
				text: item,
				color: 0xffffff * Math.random(),
				opacity: this.opacity,
				top: this.top,
				bottom: this.bottom,
				left: this.left,
				right: this.right
			});
			this.add(label);
		break;
		case 'object':
			var labelList = new CollapsableLabelBlockList({
				text: 'array',
				list: item,
				color: 0xffffff * Math.random(),
				opacity: this.opacity,
				top: this.top,
				bottom: this.bottom,
				left: this.left,
				right: this.right
			});
			this.add(labelList);
		break;
	}
}

LabelBlockList.prototype.setPositionByEdges = function() {
	// this.position.x = this.left;
	this.position.y = this.top;
	var height = this.top - this.bottom;
	for (var i = 0; i < this.children.length; i++) {
		var ratioTop = -i / this.children.length;
		var ratioBottom = -(i+1) / this.children.length;
		var child = this.children[i];
		child.top = ratioTop * height;
		child.bottom = ratioBottom * height;
		child.setPositionByEdges();
	};


}

module.exports = LabelBlockList;