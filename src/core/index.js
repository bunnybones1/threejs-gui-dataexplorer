var globalize = require('globalizejs');
var ThreejsGuiDataexplorer = {
	sampleFunction: function(){
		console.log("sample core function!");
	},
	utils: require('./utils'),
	view: require('./view'),
	GUI: require('./gui')
};
globalize('ThreejsGuiDataexplorer', ThreejsGuiDataexplorer);
module.exports = ThreejsGuiDataexplorer;