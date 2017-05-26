var defaults = require ('./options.defaults.config');
var helper = require ('./utils/helpers' );
var preprocess = helper.ConfigHelper.preprocess_paths;
var merge = helper.merge;

// load user's definition of project config
var projectConfig = {reportsPath: {}, eslint: {}, karma: {}};
try {
	projectConfig = require('../project.config');
} catch (e) {
	console.log ("No Config, using empty objects");
}

// merge with defaults
var reportsPaths = preprocess(merge(defaults.reportsPaths, projectConfig.reportsPaths));
var eslint = merge(defaults.eslint, projectConfig.eslint);
var karma = merge(defaults.karma.preprocess(defaults.karma, reportsPaths), projectConfig.karma);

// except for this
// either its the user input or null
var jenkins = merge(defaults.jenkins, projectConfig.jenkins);

// exports 
module.exports.reportsPaths = reportsPaths;
module.exports.eslint = eslint;
module.exports.karma = karma;
module.exports.jenkins = jenkins;