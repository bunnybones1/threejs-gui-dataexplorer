//don't require core functionality from sample code.
//Instead, reference the global instance.
// var View = require('../core/view/View');
// var FPS = require('../core/utils/FPS');
var View = ThreejsGuiDataexplorer.view.View;
var Label = require('threejs-label').label;

// var FPS = ThreejsGuiDataexplorer.utils.FPS;
function SampleExample() {
	console.log("Sample Example!");
	//all you really need
	var view = new View();


	var gui = new ThreejsGuiDataexplorer.GUI(
		view.renderer,
		new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100)	
	);

	var fontProps = {
		size: .2
	}
	var label1 = new Label('Testing GUI Text 1', fontProps, undefined, undefined, true);
	var label2 = new Label('Testing GUI Text 2', fontProps, undefined, undefined, true);
	var label3 = new Label('Testing GUI Text 3', fontProps, undefined, undefined, true);
	gui.add(label1);
	gui.add(label2);
	gui.add(label3);
	var size1 = label1.geometry.boundingBox.size();
	var size3 = label3.geometry.boundingBox.size();
	label1.position.y += size1.y*1.2;
	label3.position.y -= size3.y*1.2;




	//just something for the backdrop

	//add fog
	view.scene.fog = new THREE.FogExp2( 0x3f1f00, 0.1 );
	//now let's play with some objects!
	//all units are in metres
	var totalBalls = 100;
	var balls = [];

	var birthBoxSize = 1;
	var birthBoxSizeHalf = birthBoxSize * .5;

	//for center of gravity
	var totalMass = 0;
	var centerOfMass = new THREE.Vector3();
	
	//for ball physics
	var initVelocity = .0002;
	var initVelocityHalf = initVelocity * .5;

	//lights
	var light = new THREE.PointLight(0xffffff, 3);
	view.scene.add(light);
	var hemisphereLight = new THREE.HemisphereLight(0x7f6f5f, 0x7f0000);
	view.scene.add(hemisphereLight);

	//let make some balls!
	for (var i = totalBalls - 1; i >= 0; i--) {
		//standard threejs ball stuff
		var radius = Math.pow(Math.random(), 4) * .2 + .05;
		var ball = new THREE.Mesh(
			new THREE.SphereGeometry(radius),
			new THREE.MeshPhongMaterial()
		);
		ball.position.set(
			Math.random() * birthBoxSize - birthBoxSizeHalf,
			Math.random() * birthBoxSize - birthBoxSizeHalf,
			Math.random() * birthBoxSize - birthBoxSizeHalf
		)
		balls.push(ball);
		view.scene.add(ball);

		//extra stuff for physics
		var mass = Math.pow(radius, 3)
		ball.mass = mass;
		totalMass += mass;
		ball.velocity = new THREE.Vector3(
			Math.random() * (initVelocity - initVelocityHalf) / mass,
			Math.random() * (initVelocity - initVelocityHalf) / mass,
			Math.random() * (initVelocity - initVelocityHalf) / mass
		);

	}

	//on every frame
	view.renderManager.onEnterFrame.add(function() {
		// console.log(FPS.animSpeedCompensation);
		//calculate center of gravity
		centerOfMass.set(0,0,0);
		for (var i = totalBalls - 1; i >= 0; i--) {
			var ball = balls[i];
			centerOfMass.add(ball.position.clone().multiplyScalar(ball.mass/totalMass));
		};
		//keeps the center of gravity from drifting into space
		centerOfMass.multiplyScalar(.99);
		//apply physics
		for (var i = totalBalls - 1; i >= 0; i--) {
			var ball = balls[i];
			var dist = ball.position.clone().sub(centerOfMass);
			ball.velocity.sub(
				dist.multiplyScalar(.00001 / (ball.mass * dist.length()))
			);
			ball.position.add(ball.velocity);
			ball.scale.z = 1 + ball.velocity.length() * 30;
			ball.scale.x = ball.scale.y = 1/Math.sqrt(ball.scale.z);
			ball.lookAt(ball.position.clone().add(ball.velocity))
		};
		//put light and camera focus in the center of gravity
		light.position.copy(centerOfMass);
		view.camera.lookAt(centerOfMass);
	})
}
module.exports = SampleExample;