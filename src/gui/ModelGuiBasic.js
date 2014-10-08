var Label = require('threejs-label').label;
var getBoundingBoxOfChildren = require('threejs-getboundingboxofchildren');
var alreadyExists = [];

function ifAlreadyExists(obj) {
	if(alreadyExists.indexOf(obj) != -1) return true;
	alreadyExists.push(obj);
	return false;
}
function modelGui(obj, name, gui) {
	var model;
	name = name || 'root';
	if(obj instanceof Array) {
		if(ifAlreadyExists(obj)) return;
		console.log(name, 'Array');
		var tempGui = new ModelGuiBasic(obj, name, gui);
	} else if (typeof obj == 'number') {
		console.log(name, 'Number', obj);
		gui.add(new Label(
			{
				text: 'Number ' + obj,
				bg: true
			}
		));
		model = obj;
	} else if (typeof obj == 'string') {
		console.log(name, 'String', obj);
		gui.add(new Label(
			{
				text: 'String ' + obj,
				bg: true
			}
		));
		model = obj;
	} else if (obj instanceof Function) {
		if(ifAlreadyExists(obj)) return;
		console.log(name, 'Function', obj);
		gui.add(new Label(
			{
				text: 'Function ' + obj.toString().substring(0, 20) + '...',
				bg: true
			}
		));
		model = obj;
	} else if (typeof obj == 'boolean') {
		console.log(name, 'Boolean');
		gui.add(new Label(
			{
				text: 'Boolean ' + obj,
				bg: true
			}
		));
		model = obj;
	} else if (obj instanceof Object) {
		if(ifAlreadyExists(obj)) return;
		console.log(name, 'Object');
		var tempGui = new ModelGuiBasic(obj, name, gui);
	}
	return model;
}

function modelGuiArray(obj, name, gui) {
	var modelArray = [];
	var label = new Label(
		{
			text: 'array'+'>>>>',
			bg: true
		}
	);
	gui.add(label, true, true);
	for (var i = obj.length - 1; i >= 0; i--) {
		var child = obj[i];
		modelArray.push(modelGui(child, name + '[' + i + ']', gui));
	};
	return modelArray;
}

function modelGuiObject(obj, name, gui) {
	var modelObject = {};
	var label = new Label(
		{
			text: 'object'+'>>>>',
			bg: true
		}
	);
	gui.add(label, true, true);
	for(var key in obj) {
		var child = obj[key];
		modelObject[key] = modelGui(child, name + '.' + key, gui);
	}
	return modelObject;
}


function ModelGuiBasic(model, name, gui) {
	name = name || 'root';
	THREE.Object3D.call(this);
	this.listItems = [];
	this.listChild = new THREE.Object3D();
	this.add(this.listChild);

	var _this = this;
	var oldAdd = this.add.bind(this);
	this.add = function(object, interactive, label) {
		if(label) {
			_this.label = object;
			oldAdd(object);
		} else {
			_this.listItems.push(object);
			_this.listChild.add(object);
		}
		_this.updateLayout();
	}

	if(model instanceof Array) {
		modelGuiArray(model, name, this);
	} else if (model instanceof Object) {
		modelGuiObject(model, name, this);
	}
	if(gui) gui.add(this);
}

ModelGuiBasic.prototype = Object.create(THREE.Object3D.prototype);

ModelGuiBasic.prototype.updateLayout = function() {
	cursor = 0;
	maxWidth = 0;
	for (var i = 0; i < this.listItems.length; i++) {
		var child = this.listItems[i];
		child.position.y = cursor;
		child.position.x = cursor;
		var size = getBoundingBoxOfChildren(child.children[0]).size();
		cursor -= size.y;
		maxWidth = Math.max(maxWidth, size.x);
	};
	var recenter = cursor * .5;
	recenter += getBoundingBoxOfChildren(this.label.children[0]).size().y * .5;
	this.listChild.x = maxWidth;

	for (var i = 0; i < this.listItems.length; i++) {
		var child = this.listItems[i];
		child.position.x = maxWidth * .5;
		child.position.y -= recenter;
	};

}

module.exports = ModelGuiBasic;
