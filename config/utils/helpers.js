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

module.exports.setGitRemoteURL = function (url) {
	var exec = require ("child_process").exec;
	exec ("rmdir .git /s /q && " + 
		  "git init && " +
		  "git remote add origin " + url, function (error, stdout, stderr) {
		if (!error) {
			console.log (stdout);
			console.log ("Changed git remote url to: " + url);
		} else {
			console.log (stderr);
		}
	});
}

module.exports.ConfigHelper = require ("./Config.helper");
module.exports.FileSystemHelper = require ("./FileSystem.helper");
module.exports.ESLintCLIHelper = require ("./ESLintCLI.helper");
module.exports.RocketchatHelper = require ("./Rocketchat.helper");