var beenThere = [];

function model(obj, name) {
	name = name || 'root';
	if(beenThere.indexOf(obj) != -1) return;
	beenThere.push(obj);
	if(obj instanceof Array) {
		console.log(name, 'Array');
		return modelArray(obj, name);
	} else if (obj instanceof Number) {
		console.log(name, 'Number', obj);
		return obj;
	} else if (obj instanceof String) {
		console.log(name, 'String', obj);
		return obj;
	} else if (obj instanceof Function) {
		console.log(name, 'Function', obj.toString().substring(0, 20) + '...');
		return obj;
	} else if (obj === true || obj === false) {
		console.log(name, 'Boolean');
		return obj;
	} else if (obj instanceof Object) {
		console.log(name, 'Object');
		return modelObject(obj, name);
	}
}

function modelArray(obj, name) {
	var modelArray = [];
	for (var i = obj.length - 1; i >= 0; i--) {
		var child = obj[i];
		model(child, name + '[' + i + ']');
	};
	return modelArray;
}

function modelObject(obj, name) {
	var modelObject = {};
	for(var key in obj) {
		var child = obj[key];
		modelObject[key] = model(child, name + '.' + key);
	}
	return modelObject;
}

module.exports = model;