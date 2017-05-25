function readInput () {
	var readline = require ('readline');
	var interface = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	var config = {karma:{}, eslint:{}, reportsPaths:{}}; //require ("../../project.config");
	query(interface, "Rocketchat Channel Name:\n", function(channel){
		processRocketChatChannel(channel, config, function () {
			query(interface, "Karma Server Port:\n", function (port) {
				processKarmaPort(port, config, function () {
					createProjectConfig(interface, config);
				});
			});
		});
	});
}

function query (interface, msg, callback) {
	interface.question(msg, function (input) {
		interface.write ("\n");
		callback(input);
	});
}
function processRocketChatChannel (channel, config, callback) {
	//validate input
	config.rocketchatChannel = channel;
	callback();
}
function processKarmaPort (port, config, callback) {
	config.karma.port = parseInt(port);
	callback();
}
function createProjectConfig (interface, config) {
	var resultsString = formatConfig(config);
	writeToFile (resultsString);
	interface.close();
}

function formatConfig (config) {
	var util = require ('util');
	var resultsString = "module.exports = " 
		+ util.inspect(config, {depth: null, maxArrayLength: null}) 
			.replace ("{", "{\n ")
			.replace (/\n/g, "\n  ")
			.replace (/}$/, "\n}")
		+ "\n";
	return resultsString;
}

function writeToFile (resultsString) {
	var fs = require('fs');
	fs.open ("../../project.config.js", 'w', function (err) {
		if (err)
			return console.log(err);
		fs.writeFile ("./project.config.js", resultsString, function(err) {
			if (err)
				return console.log(err);
			console.log ("Config File Created");
		})
	});
	
}

readInput();