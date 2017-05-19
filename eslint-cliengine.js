var fs = require('fs'); // node file system
var path = require ('path');
var CLIEngine = require('eslint').CLIEngine
var writeFileCallback = require ('./app/test/reports/utils/helpers').writeFileCallback;
var eslint_options = require ('./app/test/reports/utils/reports_filepath.js').types.eslint;

// init eslint eliengine
var cli = new CLIEngine ();

// eslint will execute on all the files in the dir 
// to generate the report
var report = cli.executeOnFiles(['app/src/']);

// for each format, write the report to file allocated to each format
for (var format in eslint_options.formats) {
	var pathToFile = path.resolve(__dirname + "/app", eslint_options.outputFile[format]);
	var formatter = cli.getFormatter(format);
	var result = formatter(report.results);
	fs.writeFile(pathToFile, result, writeFileCallback(format + ": File Write Complete"));
}