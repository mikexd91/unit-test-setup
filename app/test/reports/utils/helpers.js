// PRE: takes in paths object with populated value
// POST: paths object with 
//		 - outputDir path
//		 - outputFile paths
//		 - filename with extensions
module.exports.preprocess_paths = function (paths) {

	var subfolder;
	var filename;
	var filenameExt;
	var formatObj = {} //format in obj form

	for (var key in paths.types) {
		var currentType = paths.types[key];

		//init empty objects
		currentType['outputDir'] = {};
		currentType['outputFile'] = {};
		formatObj = {};

		filename = currentType.filename;
		currentType.filename = {};

		currentType.formats.forEach(function(format, index, arr){
			//filename with ext
			filenameExt = filename + paths.ext(format);
			currentType.filename[format] = filenameExt;

			//folder path
			subfolder = paths.base + currentType.dir + '/' + format; 
			currentType['outputDir'][format] = subfolder; 

			//folder path + filename
			currentType['outputFile'][format] = subfolder + '/' + filenameExt

			//change format from array to obj
			formatObj[format] = format;
		});

		//update currentType format
		currentType.formats = formatObj;
	};

	return paths;
}

// PRE: a valid file path and a callback function to be executed upon successful reading
// POST: if no error, callback will be executed, else err will be logged
module.exports.readFile = function (file, callback) {
	var fs = require('fs');
	fs.readFile(file, {encoding: 'utf-8'}, function(err,data){
		if (!err) {
		    callback(data);
		} else {
		    console.log(err);
		}
	});
}

// PRE: obj given with pre being things to be
//		printed for each level, brought forward to next level
// POST: object printed orderly
module.exports.printObject = function (resultObj, pre = "") {

	if (typeof resultObj != 'object') {
		console.log (pre + resultObj);
	} else {
		for (var key in resultObj) {

			if (Array.isArray(resultObj[key])) {
				console.log(pre + key + ":");
				for (var i = 0; i < resultObj[key].length; i++) {
					module.exports.printObject (resultObj[key][i], pre + "...");
				}
			} else if (typeof resultObj[key] == 'object') {
				console.log(pre + key + ":");
				//recursive call
				module.exports.printObject (resultObj[key], pre + "...");
			} else {
				console.log (pre + key + ": " + resultObj[key]);
			}
		}
	}

	if (pre == "")
		console.log();
}


//PRE: 
//POST: a function that will call special message to be called if there is no err will be returned
module.exports.writeFileCallback = function (msg) {
	return function (err) {
		if (err) {
			return console.log(err);
		} else {
			console.log (msg);
		}
	}
}

// PRE: CoverageConfig passed in with all the neccesary values
// POST: returns a configuration for the Coverage Reporter 
module.exports.generateCoverageReporterConfig = function (coverageConfig) {
	var reporterConfig = []
	for (var format in coverageConfig.formats) {
		reporterConfig.push({
			type: coverageConfig.formats[format],
            dir: coverageConfig.outputDir[format],
            file: "../" + coverageConfig.filename[format]
		});
	}
	return reporterConfig;
}