var ConfigGenerator = {}

ConfigGenerator.getErrorString = function (err) {
	switch (err) {
		case 1: return "SUCCESS";
		case 2: return "Value cannot be empty";
		case 3: return "Invalid input type: ";
		default: return "Unknown Error"
	}
}

ConfigGenerator.makeStatus = function (msg = '', skipOnEmpty = true, validator = null) {
	var code = 1, errMsg = '';
	if (!skipOnEmpty && msg.length == 0) {
		code = 2;
	} else if (validator != null) {
		errMsg = validator(msg);
		if (errMsg != null)
			code = 3;
		else errMsg = '';
	} 

	return { code: code, msg: ConfigGenerator.getErrorString(code) + errMsg};
}

ConfigGenerator.createNestedQuery = function (interface, queries) {
	function query (msg, callback) {
		interface.question(">> " + msg + "\n", function (input) {
			interface.write ("\n");
			callback(input);
		});
	}
	function nestedQuery (i, callback, status = ConfigGenerator.makeStatus(), tries = 0) {
		if (i >= queries.length) 
			callback(status);
		else if (tries > 2) {
			console.log ("Too many tries moving on...\n");
			nestedQuery (i + 1, callback);
		} else if (status.code > 1) {
			console.log ("!! Error: " + status.msg + "\n");
			nestedQuery (i - 1, callback, ConfigGenerator.makeStatus(), tries + 1);
		} else {
			query (queries[i].question, function (msg) {
				var returnStatus = queries[i].callback(msg);
				nestedQuery (i + 1, callback, returnStatus, tries);
			});
		}
	}
	return nestedQuery;
}

ConfigGenerator.query = function (question, callback, skipOnEmpty = true, validator = null) {
	var obj = {
		question: question,
		callback: function (msg) { 
			var status = ConfigGenerator.makeStatus(msg, skipOnEmpty, validator);
			if (status.code > 1)
				return status;

			callback(msg);
			return status;
		},
		validator: validator
	}
	return obj;
}


ConfigGenerator.createProjectConfig = function (interface, config, status) {
	var ObjectToFileWriter = require("./helpers").FileSystemHelper.ObjectToFileWriter;
	var filewriter = new ObjectToFileWriter("./project.config.js");
	filewriter.write(config, function (err) {
		if (err) 
			return console.log (err);

		var msg = (status.code > 1) ? "Config file created with Error" : "Config file created";
		console.log (msg + "\n");
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

ConfigGenerator.gitConfigHandler = function (msg) {
	ConfigGenerator.removeGitFolder ();
	if (ConfigGenerator.isValidGitRepo)
		ConfigGenerator.setGitRemoteURL (msg);
}

ConfigGenerator.removeGitFolder = function () {
	var removeDir = require ("./FileSystem.helper").removeDir;
	removeDir ('./.git');
}

ConfigGenerator.setGitRemoteURL = function (url) {
	var exec = require ("child_process").exec;
	exec ("git init && " +
		  "git remote add origin " + url, function (error, stdout, stderr) {
		if (!error) {
			console.log ("set git remote url to: " + url);
		} else {
			console.log (stderr);
		}
	});
}

ConfigGenerator.isValidGitRepo = function (url) {
	return url.length > 0
}

module.exports = ConfigGenerator;