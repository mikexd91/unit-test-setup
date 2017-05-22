var path = require('path');
var helper = require('../utils/helpers');
var readFile = helper.readFile;
var printObject = helper.printObject;

function Rocketchat () {
	var filePaths = require ('../utils/reports_filepath.js');
	for (var type in filePaths.types) {
		if (type == 'eslint') {
			var outputFilePath = path.resolve (__dirname, "../../../" + filePaths.types[type].outputFile.json);
			readFile(outputFilePath, readFileComplete(type));
		} else if (type == 'unitTest') {
			var outputFilePath = path.resolve (__dirname, "../../../" + filePaths.types[type].outputFile.junit);
			readFile(outputFilePath, readFileComplete(type));
		}
	}
}

function readFileComplete (type) {
	return function(data){ processData (type, data); }
}

function parseXML (data) {

	var DOMParser = require("xmldom").DOMParser;
	var doc = new DOMParser().parseFromString(data);
	return doc;
}


function processData(type, data) {
	
	switch (type) {
		case 'unitTest' :{ 
			var xml = parseXML(data);
			processUnitTest(xml); 
			break;
		}
		case 'eslint' : {
			var json = JSON.parse(data);
			processEslint(json); 
			break;
		}
	}

}

function processUnitTest (dom) {
	var result = {
		success: 0,
		failure: {
			normal: 0,
		}
	}
	var testcases = dom.documentElement.getElementsByTagName("testcase");
	var testcase;
	var failCount = 0;
	for (var i = 0; i < testcases.length; i++) {
		testcase = testcases[i];
		var classname = testcase.getAttribute("classname");
		var isFailure = testcase.getElementsByTagName("failure").length > 0;

		if (isFailure) {
			failCount++;
			var token = classname.match(/@@[a-zA-Z0-9]+/g);
			var tag = (token == null) ? 'normal' : token[0];
			result.failure[tag] = (result.failure[tag] == null) ? 1 : result.failure[tag] + 1;
		} else {
			result.success++;
		}
	}

	result.failure.total = failCount;

	printObject({'unit-test' : result});
}

function processEslint (json) {
	var errorCount = warningCount = 0;
	json.forEach(function (data, index, arr){
		errorCount += data.errorCount;
		warningCount += data.warningCount;
	});

	printObject({
		"Lint Result" : {
			"Error Count" : errorCount,
			"Warning Count" : warningCount
		}
	})
}

Rocketchat();