var path = require('path');
var options = require ('../config/options.config.js');
var filePaths = options.reportsPaths;

function Rocketchat (args) {
	if (args == "ROCKETCHAT") {
		sendReportSummary ();
	} else if (args == "VARIABLES") {
		sendPaths ();
	}
}

function sendPaths () {
	sendJUnitPath();
	sendCoveragePath();
	sendESLintPath();
	sendChannelName();
}
function sendJUnitPath () {
	console.log(path.join(options.eslint.pathToApp, filePaths.types.unitTest.outputFile.junit));
}
function sendCoveragePath () {
	console.log(path.join(options.eslint.pathToApp, filePaths.types.coverage.outputFile.cobertura));
}
function sendESLintPath () {
	console.log(path.join(options.eslint.pathToApp, filePaths.types.eslint.outputFile.checkstyle));
}
function sendChannelName () {
	console.log(options.jenkins.rocketchatChannel);
}

function sendReportSummary () {

	var helper = require('../config/utils/helpers');

	var appPath = "../app/";
	for (var type in filePaths.types) {
		if (filePaths.types[type].rocketchat && 
			filePaths.types[type].rocketchat.data && 
			filePaths.types[type].rocketchat.processor) {

			var outputFilePath = path.resolve (
				__dirname, 
				appPath + filePaths.types[type].outputFile[filePaths.types[type].rocketchat.data]
			);

			var processor = filePaths.types[type].rocketchat.processor
			helper.FileSystemHelper.readFile(outputFilePath, readFileComplete(helper, processor));
		}
	}
}

function readFileComplete (helper, processor) {
	return function(data){ processData (helper, processor, data); }
}
function processData(helper, processor, data) {
	helper.printObject(processor(data))

}

Rocketchat(process.argv[2]);