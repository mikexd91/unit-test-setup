var helper = require("../config/utils/helpers");
var query = helper.ConfigGeneratorHelper.query;
var readInput = helper.ConfigGeneratorHelper.readInput;

var userDefault = require ("../config/options.defaults.config").userDefault;

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
			function (msg) { if (helper.ConfigHelper.isValidGitRepo(msg))
				helper.ConfigHelper.setGitRemoteURL(msg)
			}
		)
	]
}

readInput(setup);