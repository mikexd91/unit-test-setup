var path = require("path");

module.exports = {
	entry: './app/src/index.js',
	output: {
		path: path.resolve('./app/dist'),
		filename: 'bundle.js'
	}
}