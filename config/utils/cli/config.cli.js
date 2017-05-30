var helper = require("../functions/helpers");
var query = helper.ConfigGeneratorHelper.query;
var readInput = helper.ConfigGeneratorHelper.readInput;

var userDefault = require ("../../options.defaults.config").userDefault;

var setup = {

	config: userDefault,

	queries: [
		query (
			"Project Title",
			function (msg) { setup.config.projectTitle = msg; }
		),
		query (
			"Rocketchat Channel:", 
			function (msg) { setup.config.jenkins.rocketchatChannel = msg; }
		),
		query (
			"Email:",
			function (msg) { setup.config.jenkins.email = msg; }
		),
		query (
			"Project Git repo:",
			helper.ConfigGeneratorHelper.gitConfigHandler
		)
	]
}

readInput(setup);