function readInput (setup) {
	var readline = require ('readline');
	var interface = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	

	require("../config/utils/helpers").ConfigHelper.createNestedQuery (interface, setup.queries) (0, function () {
		createProjectConfig(interface, setup.config);
	});
}

function createProjectConfig (interface, config) {
	var ObjectToFileWriter = require("../config/utils/helpers").FileSystemHelper.ObjectToFileWriter;
	var filewriter = new ObjectToFileWriter("./project.config.js");
	filewriter.write(config, function (err) {
		if (err) 
			return console.log (err);
		console.log ("Config file created");
	});
	interface.close();
}

var setup = {

	config: { 
		projectTitle: '', 
		karma:{}, 
		eslint:{}, 
		reportsPaths:{ eslint: {}, reportsPaths: {}, karma: {}}, 
		jenkins: {}
	},

	queries: [
		{
			question: "Project Title:",
			callback: function (msg) { setup.config.projectTitle = msg; }
		},
		{ 
			question: "Channel", 
			callback: function (msg) { setup.config.jenkins.rocketchatChannel = msg; } 
		},
		{
			question: "Email",
			callback: function (msg) { setup.config.jenkins.email = msg; }
		},
		{
			question: "Git repo",
			callback: function (msg) { console.log ("git remote add " + msg + "\n"); }
		}
	]
}
readInput(setup);