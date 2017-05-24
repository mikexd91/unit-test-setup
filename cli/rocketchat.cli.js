var path = require('path');
var helper = require('../app/test/utils/helpers');
var filePaths = require ('../config/options.config.js').reportsPaths;

var readFile = helper.readFile;
var printObject = helper.printObject;

function Rocketchat () {
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

			readFile(outputFilePath, readFileComplete(processor, type));
		}
	}
}

function readFileComplete (processor) {
	return function(data){ processData (processor, data); }
}


function processData(processor, data) {
	printObject(processor(data))

}

Rocketchat();