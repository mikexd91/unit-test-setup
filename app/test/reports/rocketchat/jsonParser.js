var path = require('path');
var helper = require('../utils/helpers');
var readFile = helper.readFile;
var printObject = helper.printObject;

function Rocketchat () {
	var filePaths = require ('../reports_filepath.js');
	for (var type in filePaths.types) {
		if (type != 'coverage') {
			var outputFilePath = path.resolve (__dirname, "../../" + filePaths.types[type].outputFile.json);
			readFile(outputFilePath, function(data){ processData (type, data); });
		}
	}
}


function processData(type, data) {

	var json = JSON.parse(data);

	switch (type) {
		case 'unitTest' : processUnitTest(json); break;
		case 'eslint' : processEslint(json); break;
	}

}

function processUnitTest (json) {
	var summary = json.summary;
	printObject({
		"Test Result:" : {
			"Success:" : summary.success,
			"Failed:" : summary.failed
		}
	})
}

function processEslint (json) {
	var errorCount = warningCount = 0;
	json.forEach(function (data, index, arr){
		errorCount += data.errorCount;
		warningCount += data.warningCount;
	});

	printObject({
		"Lint Result:" : {
			"Error Count:" : errorCount,
			"Warning Count:" : warningCount
		}
	})
}

Rocketchat();