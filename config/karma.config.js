// Karma configuration
// Generated on Wed May 17 2017 15:18:10 GMT+0800 (Malay Peninsula Standard Time)
var filepaths = require('./filepath.config');

// karma's
var karma_filepaths = filepaths.karma_paths;

// reports' 
var reports_filepaths = filepaths.reports_paths;
var types = reports_filepaths.types;

//function to generate coverage report options
var generateCoverageReporterConfig = require ("../app/test/utils/helpers").generateCoverageReporterConfig;

module.exports = function(config) {
    
    var karma_config = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: karma_filepaths.base,


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files: [
            karma_filepaths.files
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            //extended with variable at the bottom
        },

        //webpack config file
        webpack: require('./webpack.config.js'),


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'junit', 'html', 'coverage'],

        //junit reporter option
        junitReporter: {
            outputDir: types.unitTest.outputDir.junit, // './reports/unit-test/junit',
            outputFile: "../" + types.unitTest.filename.junit, // unit-test-report.xml

            nameFormatter: function (browser, result) {
                return result.suite.join(" >> ") + " >> " + result.description;
            },
            classNameFormatter: function (browser, result) {
                var pkg = result.suite[0];
                var token = result.description.match(/@@[a-zA-Z0-9]+/g);
                var className = (token === null) ?  result.suite[1] : token[0];
                return pkg + "." + className;
            },
            suite: "unit"
        },

        //htmlfile reporter option
        htmlReporter: {
          outputFile: types.unitTest.outputFile.html // './reports/unit-test/html/unit-test-report.html'
        },

        //coverage reporter option
        coverageReporter: {
            reporters : generateCoverageReporterConfig (types.coverage)
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    }

    karma_config.preprocessors[karma_filepaths.files] = ['webpack', 'coverage'];

    config.set(karma_config);
}
