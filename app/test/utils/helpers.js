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
	// node's file system
	var fs = require('fs');
	fs.readFile(file, {encoding: 'utf-8'}, function(err,data){
		if (!err) {
			// read success callback
		    callback(data);
		} else {
			// read fail
		    console.log(err);
		}
	});
}

// PRE: obj given with pre being things to be
//		printed for each level, brought forward to next level
// POST: object printed orderly
module.exports.printObject = function (resultObj, pre = "") {

	if (typeof resultObj != 'object') {
		// not an object, proceed to print
		console.log (pre + resultObj);
	} else {
		// go deep into the object
		for (var key in resultObj) {
			if (Array.isArray(resultObj[key])) {
				// object in the array will have the same pre
				console.log(pre + key + ":");
				for (var i = 0; i < resultObj[key].length; i++) {
					module.exports.printObject (resultObj[key][i], pre + "...");
				}
			} else if (typeof resultObj[key] == 'object') {
				console.log(pre + key + ":");
				// recursive call
				module.exports.printObject (resultObj[key], pre + "...");
			} else {
				// resultObj[key] is not an object, proceed to console.log
				console.log (pre + key + ": " + resultObj[key]);
			}
		}
	}

	if (pre == "")
		console.log();
}

// functions exclusive to eslint.cli calls
module.exports.eslint_fn = {

	// PRE: err is either null or contains error object
	// POST: returns true if either there is not error or 
	//		 if error says that directory exist
	dirExist: function (err) {
		return (!err || err.code == 'EEXIST');
	},

	// PRE: err is either null or contains error object
	// POST: returns true if either there is not error or 
	//		 if error says that file exist
	fileExist: function (err) {
		return (!err || err.code == "ENOENT");
	},

	// PRE: fs.mkdir is called
	// POST: a function that takes in error is returned as 
	//		 the callback function
	mkdirCallback: function (fs, filepath, result, format) {

		// PRE: fs.mkdir callback
		// POST: display errors on console or 
		//		 proceed to write the reports
		return function (err) {
			if (!module.exports.eslint_fn.dirExist(err)) 
				// directory doesnt exist
				// probably failed to create directory
				return console.log(err);
			else {
				// proceed to write
				// if file doesn't exist, it'll create a file first 
				// and call this function again to try writting again
				var recursiveCall = function () {
					fs.writeFile (
						filepath, 
						result,
						module.exports.eslint_fn.writeFileCallback (
							fs, 
							filepath,
							format, 
							recursiveCall
						)
					);
				}
				
			}
		}
	},

	// PRE: fs.writeFile is called 
	// POST: a function that takes in error is returned as 
	//		 the callback function
	writeFileCallback: function (fs, path, format, recursiveCallback) {

		// PRE: fs.writeFile callback
		// POST: create and try to write again if file didnt exist or
		//		 show on console "File write Complete"
		return function (err) {

			if (err) {
				// there's an error
				if (!module.exports.eslint_fn.fileExist(err)) {
					// if error is that, file doesnt exist
					// proceed to create a new file
					// w flag indicate read/write
					fs.open (path, 'w', function (err) {
						if (err) 
							// returns with err if failed to create new file
							return console.log (err);

						// else proceed to try writting into file again
						// calls the same callback, recursively
						recursiveCall();
					});
				} else {
					console.log (err)
				}
			} else {
				// no error, indicate that write complete
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

// ESLint Data handling function
// PRE: a XML-format string data is passed
// POST: If user changed the data type but forgot to change the handler function,
//		 an error will be thrown
//		 else create and return a object that is formatted to be sent to rocketchat 
module.exports.processUnitTest = function(data) {
	try {
		// tries to parseXML
		// in case users changed data type without changing
		// the function to handle the data
		var dom = module.exports.parseXML(data);
	} catch (e) {
		//logs error and return
		console.log(e);
		return;
	} 

	// successfully parseXML
	// this is how the result will be formatted
	var result = {
		success: 0,
		failure: {
			normal: 0,
		}
	}

	// find all the testcases
	var testcases = dom.documentElement.getElementsByTagName("testcase");
	var testcase;
	// total number of fail case for a full summary
	var failCount = 0;
	for (var i = 0; i < testcases.length; i++) {
		// for every testcase
		testcase = testcases[i];
		var classname = testcase.getAttribute("classname");
		var isFailure = testcase.getElementsByTagName("failure").length > 0;

		// if it is a fail case
		if (isFailure) {
			// increment the number of failed testcase
			failCount++;
			// attempt to extract the token
			var token = classname.match(/@@[a-zA-Z0-9]+/g);
			// tag is the token if any, else defaults to 'normal'
			var tag = (token == null) ? 'normal' : token[0];
			// store in result object
			result.failure[tag] = (result.failure[tag] == null) ? 1 : result.failure[tag] + 1;
		} else {

			// increment number of success count
			result.success++;
		}
	}

	result.failure.total = failCount;
	return {'unit-test' : result};
	
}

// ESLint Data handling function
// PRE: a XML-format string data is passed
// POST: If user changed the data type but forgot to change the handler function,
//		 an error will be thrown
//		 else create and return a object that is formatted to be sent to rocketchat 

module.exports.processEslint = function (data) {
	try {

		// tries to parse json
		// in case users changed data type without changing
		// the function to handle the data
		var json = JSON.parse(data);
	} catch (e) {
		//logs error and return
		console.log(e);
		return;
	} 

	// successfully parse json file
	var errorCount = warningCount = 0;

	// just a simple counting step
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


// PRE: data is a xml string
// POST: XML Object returned
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

// PRE: Two object given
//			original: The one to inherit
//			newer: The one to be inherited
// POST: original object now inherits property of newer
//		 change in datatype is not allowed, follows original's datatype
//			i.e. original.someKey = "Hello", newer.someKey = ["Hello"] 
//				 should fail in merging
//		 merging array will merge uniquely
//			i.e. merging [1,2,3] and [1,4,5] 
//			     should result in [1,2,3,4,5]
module.exports.merge = function (original, newer) {
	for (var key in newer) {
		if (original[key] == null) {
			// if original didn't have the key, add it
			original[key] = newer[key];
		} else if (typeof original[key] != typeof newer[key]) {
			// conflicting data type
			console.log ("Change in datatype not allowed");
		} else if (Array.isArray(original[key])) {
			// If it is an array
			// merge uniquely
			uniqueMerge(original[key], newer[key]);
		} else if (typeof original[key] == 'object') {
			// If it is an object 
			// merge recursively
			module.exports.merge (newer[key], original[key])
		} else {
			// overwrite 
			original[key] = newer[key];
		}
	}

	// PRE: two array given, 
	//			arrTo: The one to inherit
	//			arrFrom: The one to be inherited
	// POST: arrTo is now merged and is unique
	function uniqueMerge(arrTo, arrFrom) {
		// a flag to see if element 
		// from arrFrom should be added to arrTo
		var toAdd = true;
		// for every item from arrFrom
		for (var i = 0; i < arrFrom.length; i++) {
			// check with every item from arrTo 
			// stops when same thing found, set toAdd flag to false
			for (var j = 0; j < arrTo.length; j++) {
				if (arrFrom[i] == arrTo[j]) {
					toAdd = false;
					break;
				}
			}

			// check and adds
			if (toAdd)
				arrTo.push(arrFrom[i]);
		}
	}

	return original;
}

// Functions for junitReporter to use to generate name and className
module.exports.junitReporter = {
	nameFormatter: function (browser, result) {
        return result.suite.join(" >> ") + " >> " + result.description;
    },
    classNameFormatter: function (browser, result) {
        var pkg = result.suite[0];
        var token = result.description.match(/@@[a-zA-Z0-9]+/g);
        var className = (token === null) ?  result.suite[1] : token[0];
        return pkg + "." + className;
    }
}

// PRE: reportsPath already preprocessed 
// POST: an array of reporters string generated
module.exports.generateReporterList = function (reportsPaths) {
	var types = reportsPaths.types;
	var reporters = ['progress'];

	if (types.unitTest != null &&
		types.unitTest.formats != null) {
		for (var format in types.unitTest.formats) {
			// for unit test,
			// add all the formats into reporter
			reporters.push(format);
		}
	} 

	if (types.coverage != null) {
		// as long as there's coverage, add it into reporters
		reporters.push ("coverage");
	}

	return reporters;

}

// PRE: karmaOptions already preprocessed
// POST: karma config object will have reporter options
module.exports.loadKarmaReporterOptions = function (karma, karmaOptions) {
    var key;
    for (var i = 0; i < karmaOptions.reporters.length; i++) {
        key = karmaOptions.reporters[i] + 'Reporter';
        if (karmaOptions.reporterOptions[key] != null) {
        	// checks if there's options defined for the reporter
            karma[key] = karmaOptions.reporterOptions[key];
        }
    }
}