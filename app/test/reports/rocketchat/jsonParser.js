var fs = require('fs');
var path = require('path');

var filePaths = require ('../reports_filepath.js');

for (var type in filePaths.types) {
	if (type != 'coverage') {
		var outputFilePath = path.resolve (__dirname, "../../" + filePaths.types[type].outputFile.json);
		readFile(outputFilePath, type);
	}
}

function readFile (file, type) {
	fs.readFile(outputFilePath, {encoding: 'utf-8'}, function(err,data){
		if (!err) {
		    processData(type, data);
		} else {
		    console.log(err);
		}
	});
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
	console.log("Test Result\nSuccess: " + summary.success + "\nFailed: " + summary.failed);
}

function processEslint (json) {
	var errorCount = warningCount = 0;
	json.forEach(function (data, index, arr){
		errorCount += data.errorCount;
		warningCount += data.warningCount;
	});

	console.log("Lint Result:");
	console.log("Error Count: " + errorCount + "\nWarning Count: " + warningCount);
	console.log();
}
