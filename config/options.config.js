var defaults = require ("./options.defaults.config");
var helper = require ("../app/test/utils/helpers");
var preprocess = helper.preprocess_paths;
var merge = helper.merge;

var reportsPaths = preprocess(merge(defaults.reportsPaths, {
	// Base
	// the base of the directory where the reports will go
	// relative to package.json

	// the different type of reports that will be generated
	// other attributes will be programatically generated 
	// in the preprocess stage below
	types: {
		
		eslint: {
			formats: ['html']
		},
		// required
		unitTest: {
			// dir: folder name
			// filename: name of each file
			formats: ['html'], //types of reports
			// rocketchat: options for sending msg to rocketchat 
			// 	   data: format of the data you'll handle
			// 	   proccessor: function to process the data
		}
	},

	// match format to file extension
	ext : function (format) {
		if (format == 'checkstyle' ||
			format == 'junit' || 
			format == 'cobertura') 
			return '.xml';
		if (format == 'html') 
			return '.html';
		if (format == 'json') 
			return '.json';
		return '.txt';
	}
}));

var eslint = merge(defaults.eslint, {
	// relative to package.json
	// pathToApp
	// files
});

var karma = merge(defaults.karma.preprocess(defaults.karma, reportsPaths), {
	//base; relative to karma.config.js
	//files; relative to base

	

});

// channel name of rocketchat
var rocketchatChannel = 'Hello';

// exports 
module.exports.reportsPaths = reportsPaths;
module.exports.eslint = eslint;
module.exports.karma = karma;
module.exports.rocketchatChannel = rocketchatChannel;