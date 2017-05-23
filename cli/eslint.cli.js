var fs = require('fs'); // node file system
var path = require ('path');
var helpers = require ('../app/test/utils/helpers');
var eslint_paths = require ('../config/filepath.config.js').eslint_paths;
var reports_path = require ('../config/filepath.config.js').reports_paths;
var CLIEngine = require ('eslint').CLIEngine;

// config for reports to be generated
var eslint_options = reports_path.types.eslint;

// functions from
var eslint_mkdirCallback = helpers.eslint_fn.mkdirCallback;
var eslint_dirExist = helpers.eslint_fn.dirExist;

// init eslint eliengine
var cli = new CLIEngine ();

// eslint will execute on all the files in the dir 
// to generate the report
var report = cli.executeOnFiles([eslint_paths.files]);

Eslint();
// mkdir eslint

function Eslint () {
	// for each format, write the report to file allocated to each format
	var pathToApp = eslint_paths.pathToApp;
	var pathToEslint = path.join(pathToApp, reports_path.base, eslint_options.dir);
	fs.mkdir (pathToEslint, function (err) {
		if (!eslint_dirExist) 
			return console.log (err);
		// foreach format
		for (var format in eslint_options.formats) {
			var pathToFolder = path.resolve(pathToApp, eslint_options.outputDir[format]);
			var pathToFile = path.resolve(pathToApp, eslint_options.outputFile[format]);

			// get result
			var formatter = cli.getFormatter(format);
			var result = formatter(report.results);

			// mkdir format-folder
			fs.mkdir (pathToFolder, eslint_mkdirCallback(fs, pathToFile, result, format));

			
		}
	});
}

