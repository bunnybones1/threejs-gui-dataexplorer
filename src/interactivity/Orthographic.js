
function hitTest(x, y) {
	return this.objects;
}

function OrthographicInteractivity() {
	console.log('Orthographic Interactivity');
	console.log(this.camera, this.scene);
	this.hitTest = hitTest.bind(this);
}
module.exports = OrthographicInteractivity;