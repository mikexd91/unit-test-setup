var preprocess = require ("./helpers").preprocess_paths;

var paths = {
	// the base of the directory where the reports will go
	base: './test/reports',

	// the different type of reports that will be generated
	// other attributes will be programatically generated 
	// in the preprocess stage below
	types: {
		eslint: {
			dir: '/eslint',
			filename: 'eslint-report',
			formats: ['checkstyle', 'html', 'json']
		},
	
		unitTest: {
			dir: '/unit-test',
			filename: 'unit-test-report',
			formats: ['html', 'json', 'junit']
		},
	
		coverage: {
			dir: '/coverage',
			filename: 'coverage-report',
			formats: ['cobertura', 'json']
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
	}
}

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

module.exports = preprocess(paths);