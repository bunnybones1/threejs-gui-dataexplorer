var globalize = require('globalizejs');
var ThreejsGuiDataexplorer = {
	examples: {
		SampleExample: require('./SampleExample')
	}
};
globalize('ThreejsGuiDataexplorer', ThreejsGuiDataexplorer);
module.exports = ThreejsGuiDataexplorer;