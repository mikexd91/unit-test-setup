var fs = require('fs');
var path = require('path');

function Rocketchat () {
	var filePaths = require ('../reports_filepath.js');
	for (var type in filePaths.types) {
		if (type != 'coverage') {
			var outputFilePath = path.resolve (__dirname, "../../" + filePaths.types[type].outputFile.json);
			readFile(outputFilePath, type);
		}
	}
}

function readFile (file, type) {
	fs.readFile(file, {encoding: 'utf-8'}, function(err,data){
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
	printResult({
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

	printResult({
		"Lint Result:" : {
			"Error Count:" : errorCount,
			"Warning Count:" : warningCount
		}
	})
}

function printResult (resultObj, space = "") {
	if (typeof resultObj != 'object') {
		console.log (space + resultObj);
	} else {
		for (var key in resultObj) {

			if (typeof resultObj[key] == 'object') {
				console.log(space + key);
				//recursive call
				printResult (resultObj[key], space + "...");
			} else {
				console.log (space + key + resultObj[key]);
			}
		}
	}

	if (space == "")
		console.log();
}

Rocketchat();