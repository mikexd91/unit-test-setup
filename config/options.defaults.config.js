var helper = require ("../app/test/utils/helpers");
var processEslint = helper.processEslint;
var processUnitTest = helper.processUnitTest;
var loadKarmaReporterOptions = helper.loadKarmaReporterOptions;
var generateReporterList = helper.generateReporterList;
var nameFormatter = helper.junitReporter.nameFormatter;
var classNameFormatter = helper.junitReporter.classNameFormatter;
var generateCoverageReporterConfig = require ("../app/test/utils/helpers").generateCoverageReporterConfig;

module.exports.reportsPaths = {
	// String: the base of the directory where the reports will go
	// relative to karma.base
	base: './test/reports',

	// Object: the different type of reports that will be generated
	// other attributes will be programatically generated 
	// in the preprocess stage below
	// relative to base
	types: {

		// Object: The setting for each type
		eslint: {

			// String: folder directory to this type of reports
			dir: '/eslint',

			// String: common filename throughout
			filename: 'eslint-report',

			// Array(String) : the type of formats to be generated
			formats: ['checkstyle', 'json'],

			// Object: setting for if this report 
			// is to be sent to rocketchat
			rocketchat: {

				// String: data type of the report data to be processed
				data: 'json',

				// Function(data:String): the function that will process the data
				processor: processEslint
			}
		},
		
		// required
		unitTest: {
			dir: '/unit-test',
			filename: 'unit-test-report',
			formats: ['junit'],
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
}

module.exports.eslint = {
	// paths are relative to package.json

	// String: path to app folder
	pathToApp: './app', 
	// String: path to files to be checked
	files: './app/src'
}

module.exports.karma = {

	// String: path to base relative to karma.config.js
	base: '../app', 

	// String: path to test's entry file relative to base
	// 		define more file in karma.config.js
	files: './test/index.test.js',

	// Array(String): a list of preprocessor for test's entry file ONLY
	// 		define more preprocessors for other files in karma.config.js
	filePreprocessor:  ['webpack', 'coverage'],

	// String: path to webpack config relative to karma.config.js
	webpack: './webpack.config.js', 

	// Number: port number for karma server to run on
	port: 9876,

	// I think we shouldn't expose this to public... 
	// Function (KarmaConfigObj, PreProccessedKarmaOption): 
	// 		a function to be called to load up the reporter options  
	// 		into KarmaConfigObj
	loadReporterOptions: function (karma, karmaOptions) {
	    var key;
	    for (var i = 0; i < karmaOptions.reporters.length; i++) {
	        key = karmaOptions.reporters[i] + 'Reporter';
	        if (karmaOptions.reporterOptions[key] != null) {
	        	// checks if there's options defined for the reporter
	            karma[key] = karmaOptions.reporterOptions[key];
	        }
	    }
	},

	// I think we shouldn't expose this to public... 
	// but the properties added can be exposed
	//
	// Function (KarmaOption, PreprocessedReportsPaths):
	// 		This is to be called only after reportPaths have been preprocessed
	// 		at options.config.js where all the paths are ready, then
	// 		proceed to populate these options into karmaOption
	preprocess: function (karmaOption, reportsPaths) {

		// Array(String): a list of reporter karma will use
		karmaOption.reporters = generateReporterList (reportsPaths);

		// Object: a collection of reporters "<dataType>Reporter"
		// reporter options follow the individual official documentations
		karmaOption.reporterOptions = {
			junitReporter: {
				outputDir: reportsPaths.types
					.unitTest.outputDir.junit, 
	            outputFile: "../" + reportsPaths.types
	            	.unitTest.filename.junit,
				nameFormatter: nameFormatter,
		        classNameFormatter: classNameFormatter
			},

			htmlReporter: {
	          outputFile: reportsPaths.types
	          	.unitTest.outputFile.html // './reports/unit-test/html/unit-test-report.html'
	        },

	        //coverage reporter option
	        coverageReporter: {
	   			// generate the reporters programatically 
	            reporters : generateCoverageReporterConfig (
	            	reportsPaths.types.coverage
	            )
	        }
		}

		return karmaOption;
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