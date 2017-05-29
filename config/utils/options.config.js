var defaults = require ('../options.defaults.config');
var helper = require ('./functions/helpers' );
var preprocess = helper.ConfigHelper.preprocess_paths;
var merge = helper.merge;

// load user's definition of project config
var projectConfig = defaults.userDefault;
try {
	projectConfig = require('../../project.config');
} catch (e) {
}

// merge with defaults
var reportsPaths = preprocess(merge(defaults.reportsPaths, projectConfig.reportsPaths));
var eslint = merge(defaults.eslint, projectConfig.eslint);
var karma = merge(defaults.karma.preprocess(defaults.karma, reportsPaths), projectConfig.karma);

// except for this
// either its the user input or null
var jenkins = merge(defaults.jenkins, projectConfig.jenkins);

// exports 
module.exports.projectTitle = (projectConfig.projectTitle == null) ? "" : projectConfig.projectTitle;
module.exports.reportsPaths = reportsPaths;
module.exports.eslint = eslint;
module.exports.karma = karma;
module.exports.jenkins = jenkins;