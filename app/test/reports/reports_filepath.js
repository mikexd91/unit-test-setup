var paths = {
	base: './reports',

	types: {
		eslint: {
			dir: '/eslint',
			filename: 'eslint-report',
			formats: ['checkstyle', 'html', 'json']
		},
	
		unitTest: {
			dir: '/unit-test',
			filename: 'unit-test-report',
			formats: ['html', 'json', 'junit']
		},
	
		coverage: {
			dir: '/coverage',
			filename: 'coverage-report',
			formats: ['cobertura', 'json']
		}
	},

	ext : function (format) {
		if (format == 'checkstyle' ||
			format == 'junit' || 
			format == 'cobertura') 
			return '.xml';
		if (format == 'html') 
			return '.html';
		if (format == 'json') 
			return '.json';
	}
}

//generat full paths
!function (paths) {

	var subfolder;
	var filename;
	var filenameExt;
	var formatObj = {} //format in obj form

	for (var key in paths.types) {
		var currentType = paths.types[key];

		//init empty objects
		currentType['outputDir'] = {};
		currentType['outputFile'] = {};
		formatObj = {};

		filename = currentType.filename;
		currentType.filename = {};

		currentType.formats.forEach(function(format, index, arr){
			//filename with ext
			filenameExt = filename + paths.ext(format);
			currentType.filename[format] = filenameExt;

			//folder path
			subfolder = paths.base + currentType.dir + '/' + format; 
			currentType['outputDir'][format] = subfolder; 

			//folder path + filename
			currentType['outputFile'][format] = subfolder + '/' + filenameExt

			//change format from array to obj
			formatObj[format] = format;
		});

		//update currentType format
		currentType.formats = formatObj;
	};

	return paths;
}(paths);

//console.log(paths.types.eslint.filename);

module.exports = paths