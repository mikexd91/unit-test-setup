var ConfigGenerator = {}

ConfigGenerator.createNestedQuery = function (interface, queries) {
	function query (msg, callback) {
		interface.question(msg, function (input) {
			interface.write ("\n");
			callback(input);
		});
	}
	function getError (isEnd, isTooManyTries) {
		if (isEnd) return 1;
		if (isTooManyTries) return 2;
	}
	function nestedQuery (i, callback, tries = 0) {
		var error = getError(i >= queries.length, tries > 2);
		if (error > 0) 
			callback(error);
		else {
			query (queries[i].question + "\n", function (msg) {
				var returnCode = queries[i].callback(msg);
				if (returnCode == 1) {
					nestedQuery (i + 1, callback);
				} else {
					nestedQuery (i, callback, tries + 1);
				}
			})
		}
	}
	return nestedQuery;
}

ConfigGenerator.skipOnEmpty = function (callback) {
	return function (msg) {
		if (msg.length > 0)
			return callback(msg);
		return 1;
	}
}

ConfigGenerator.query = function (question, callback, skipOnEmpty = true) {
	return {
		question: question,
		callback: function (msg) { 
			var err = 2;
			if (msg.length > 0 ||
				(skipOnEmpty && msg.length == 0))
				err = callback(msg); 
			return err ? err : 1; 
		}
	}
}


ConfigGenerator.createProjectConfig = function (interface, config, status) {
	var ObjectToFileWriter = require("./helpers").FileSystemHelper.ObjectToFileWriter;
	var filewriter = new ObjectToFileWriter("./project.config.js");
	filewriter.write(config, function (err) {
		if (err) 
			return console.log (err);

		var msg = (status > 1) ? "Config file created with Error" : "Config file created";
		console.log (msg);
	});
	interface.close();
}

ConfigGenerator.readInput = function (setup) {
	var readline = require ('readline');
	var interface = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	
	ConfigGenerator.createNestedQuery (interface, setup.queries) (0, function (status) {
		ConfigGenerator.createProjectConfig(interface, setup.config, status);

	});
}

module.exports = ConfigGenerator;