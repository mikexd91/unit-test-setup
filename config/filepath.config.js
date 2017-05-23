var helper = require ("../app/test/utils/helpers");
var preprocess = helper.preprocess_paths;
var processEslint = helper.processEslint;
var processUnitTest = helper.processUnitTest;

module.exports.eslint_paths = {
	//relative to package.json
	pathToApp: './app', 
	files: './app/src'
}

module.exports.karma_paths = {
	base: '../app', //relative to karma.config.js
	files: './test/index.test.js' //relative to base
}

module.exports.reports_paths = preprocess({
	// the base of the directory where the reports will go
	// relative to package.json
	base: './test/reports',

	// the different type of reports that will be generated
	// other attributes will be programatically generated 
	// in the preprocess stage below
	types: {
		eslint: {
			dir: '/eslint',
			filename: 'eslint-report',
			formats: ['checkstyle', 'html', 'json'],
			rocketchat: {
				data: 'json',
				processor: processEslint
			}
		},
	
		unitTest: {
			dir: '/unit-test',
			filename: 'unit-test-report',
			formats: ['html', 'junit'],
			rocketchat: {
				data: 'junit',
				processor: processUnitTest
			}
		},
	
		coverage: {
			dir: '/coverage',
			filename: 'coverage-report',
			formats: ['cobertura', 'html', 'json']
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
})

//Format after preprocessing: 
// paths = {
// 	base : //base path
// 	types : {
// 		type #1: {
// 			dir: //directory
// 			filename: //filename
// 			formats: [
// 				format1: 'format1',
// 				format2: 'format2',
// 				...
// 			],
// 			outputDir: [
// 				format1: //path to folder containing report of format1
// 				format2: //path to folder containing report of format2
// 				...
// 			],
// 			outputFile: [
// 				format1: //path to file containing report of format1
// 				format2: //path to file containing report of format2
// 				...
// 			]
// 		}
// 		...
// 	}
// }