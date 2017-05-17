// Karma configuration
// Generated on Wed May 17 2017 15:18:10 GMT+0800 (Malay Peninsula Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './app/test',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
        './src/index.test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        './src/index.test.js':['webpack','coverage']
    },

    //webpack config file
    webpack: require('./webpack.config.js'),


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['junit', 'html', 'coverage'],

    //junit reporter option
    junitReporter: {
        outputDir: './reports/unit-test/junit',
        outputFile: 'unit-test-report.xml'
    },

    //htmlfile reporter option
    htmlReporter: {
      outputFile: './reports/unit-test/html/unit-test-report.html'
    },

    //coverage reporter option
    coverageReporter: {
        type: 'cobertura',
        dir: './reports/unit-test/coverage'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
