function onReady() {

	var View = require('threejs-managed-view').View;
	var model = require('./').utils.model;
	var GuiScene = require('./').gui.GuiScene;
	var ModelGuiBasic = require('./').gui.ModelGuiBasic;
	var CollapsableLabelBlockList = require('./').gui.CollapsableLabelBlockList;
	var onResizeSignal = require('input-resize').onResize;
	var OrbitingBalls = require('threejs-orbitingballs');
	//all you really need
	var view = new View({
		stats: true
	});
	var gui = new GuiScene(
		view.renderer,
		new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100)	
	);

	var selector = function(hits) {
		return hits[0];
	}

	var hits = gui.interactivity.hitTest(0,0);
	var hit = selector(hits);
	console.log(hit);

	var collapsableLabelBlockList = new CollapsableLabelBlockList({
		top: 2,
		bottom: -2,
		left: 0,
		right:3,
		text: 'test',
		list: [
			'test1',
			'test2',
			'test3',
			{
				tests1 : [
					'test6a',
					'test6b'
				],
				tests2: 'test4b',
				tests3: 'test4c',
				tests4: [
					'test5a',
					'test5b',
					'test5c',
					'test5d'
				]
			}
		]
	});

	gui.add(collapsableLabelBlockList);

	gui.focusChildren.push(collapsableLabelBlockList);
	// gui.focusChildren.push(collapsableLabelBlockList.children[1].children[1]);
	// gui.focusChildren.push(collapsableLabelBlockList.children[1].children[3].children[1].children[0]);
	// gui.focusChildren.push(collapsableLabelBlockList.children[1].children[1]);

	gui.centerOn(gui.focusChildren);

	onResizeSignal.add(function(width, height){
		gui.centerOn(gui.focusChildren);
	});



	//just something for the backdrop

	//fog
	view.scene.fog = new THREE.FogExp2( 0x3f1f00, 0.1 );

	//lights
	var light = new THREE.PointLight(0xffffff, 3);
	view.scene.add(light);
	var hemisphereLight = new THREE.HemisphereLight(0x7f6f5f, 0x7f0000);
	view.scene.add(hemisphereLight);

	//balls
	var ballMat = new THREE.MeshPhongMaterial();
	var orbitingBalls = new OrbitingBalls(100, ballMat);
	view.scene.add(orbitingBalls);

	//animate
	view.renderManager.onEnterFrame.add(orbitingBalls.onEnterFrame);
	function onEnterFrame() {
		//put light and camera focus in the center of gravity
		light.position.copy(orbitingBalls.centerOfMass);
		view.camera.lookAt(orbitingBalls.centerOfMass);
	}
	view.renderManager.onEnterFrame.add(onEnterFrame);
}

var loadAndRunScripts = require('loadandrunscripts');
loadAndRunScripts(
	[
		'bower_components/three.js/three.js',
		'lib/stats.min.js',
		'lib/threex.rendererstats.js'
	],
	function() {
		loadAndRunScripts(
			['lib/cranberry_gin_regular.typeface.js'],
			onReady
		);
	}
);