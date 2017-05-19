var baseOutputDir = './app/test/reports/eslint/';
var fileName = 'eslint-report';
var formatters = [
	{ format:'html', fileExt:'.html'},
	{ format:'checkstyle', fileExt:'.xml'},
	{ format:'json', fileExt:'.json'}
]

var fs = require('fs');

var writeFile_err = function (msg) {
	return function (err) {
		if (err) {
			return console.log(err);
		} else {
			console.log (msg + ": File Write Complete");
		}
	}
}

var CLIEngine = require('eslint').CLIEngine

var cli = new CLIEngine ();

var report = cli.executeOnFiles(['app/src/']);

var htmlFormatter = cli.getFormatter('html');

for (var i = 0; i < formatters.length; i++) {
	var f = formatters[i];
	var pathToFile = baseOutputDir + f.format + '/' + fileName + f.fileExt;
	var formatter = cli.getFormatter(f.format);
	var result = formatter(report.results);
	fs.writeFile(pathToFile, result, writeFile_err(f.format));
}