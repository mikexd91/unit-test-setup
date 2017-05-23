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

module.exports.eslint_fn = {
	dirExist: function (err) {
		return (!err || err.code == 'EEXIST');
	},

	mkdirCallback: function (fs, filepath, result, format) {
		return function (err) {
			if (!module.exports.eslint_fn.dirExist) 
				return console.log(err);
			else 
				fs.writeFile (
					filepath, 
					result,
					module.exports.eslint_fn.writeFileCallback (fs, filepath, result, format)
				);
		}
	},

	writeFileCallback: function (fs, path, result, format) {
		return function (err) {

			if (err) {
				if (err.code == "ENOENT") {
					fs.open (path, 'w', function (err) {
						if (err) 
							return console.log (err);
						fs.writeFile(path, result, module.exports.writeFileCallback(fs, path, result, format));
					});
				}
			} else {
				console.log (format + ": File Write Complete");
			}
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

module.exports.processUnitTest = function(data) {
	try {

		var dom = module.exports.parseXML(data);

	} catch (e) {

		console.log(e);
		return;

	} 

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

	return {'unit-test' : result};
	
}

module.exports.processEslint = function (data) {
	try {
		var json = JSON.parse(data);
	} catch (e) {
		console.log(e);
		return;
	} 

	var errorCount = warningCount = 0;
	json.forEach(function (data, index, arr){
		errorCount += data.errorCount;
		warningCount += data.warningCount;
	});

	return {
		"Lint Result" : {
			"Error Count" : errorCount,
			"Warning Count" : warningCount
		}
	};
}

module.exports.parseXML = function (data) {
	var DOMParser = require("xmldom").DOMParser;
	try {
		var doc = new DOMParser().parseFromString(data);
	} catch (e) {
		throw e;
		return;
	} finally {
		return doc;
	}
}