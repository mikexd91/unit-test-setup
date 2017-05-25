var fs = require('fs'); // node file system
var path = require ('path');
var helpers = require ('../config/utils/helpers');
var eslintOptions = require ('../config/options.config.js').eslint;
var reportsPath = require ('../config/options.config.js').reportsPaths;
var CLIEngine = require ('eslint').CLIEngine;

// config for reports to be generated
var reportsPathEslint = reportsPath.types.eslint;

// functions from
var eslint_mkdirCallback = helpers.eslint_fn.mkdirCallback;
var eslint_dirExist = helpers.eslint_fn.dirExist;

// init eslint eliengine
var cli = new CLIEngine ();

// eslint will execute on all the files in the dir 
// to generate the report
var report = cli.executeOnFiles([eslintOptions.files]);

Eslint();
// mkdir eslint

function Eslint () {
	// for each format, write the report to file allocated to each format
	var pathToApp = eslintOptions.pathToApp;
	var pathToEslint = path.join(pathToApp, reportsPath.base, reportsPathEslint.dir);
	fs.mkdir (pathToEslint, function (err) {
		if (!eslint_dirExist) 
			return console.log (err);
		// foreach format
		for (var format in reportsPathEslint.formats) {
			var pathToFolder = path.resolve(pathToApp, reportsPathEslint.outputDir[format]);
			var pathToFile = path.resolve(pathToApp, reportsPathEslint.outputFile[format]);

			// get result
			var formatter = cli.getFormatter(format);
			var result = formatter(report.results);

			// mkdir format-folder
			fs.mkdir (pathToFolder, eslint_mkdirCallback(fs, pathToFile, result, format));

			
		}
	});
}

