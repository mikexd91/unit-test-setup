# Project Title

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus odio nec facilisis sodales. Curabitur sed est hendrerit, rutrum justo ut, consectetur odio.

## Installation
1. Clone from git
    - Open up either your `terminal(Mac OS)` or `cmd(windows)`
    - Navigate to your project folder
        - `cd ./your/project/folder`
    - Execute `git init`
    - Lastly, clone project repository by executing:
        - `git clone <PROJECT GIT URL>`

2. Install Dependencies 
    - simply execute `npm install`

3. Setup configuration
    - Again in either terminal or cmd execute `npm run config`
    - You will be presented with 2 questions
        - `rocketchat channel name:String` --- if you have rocketchat already hooked up with jenkins you can enter the rocketchat channel name that you want test reports summamry to be senet to.
        - `Karma port number:Number` --- this is the port number that Karma runner will run all the test on. Defaults to `9876`

## Getting Started
- The tests are carried out in two stage
    - ***Mandatory-Stage:*** 
        - Every test in this stage must pass in order to continue to Src-stage
        - Tests are stored in `"./mandatory"` folder relative to the **entry file**
    - ***Open-Stage***
        - The rest of the test are then carried out after the Mandatory-Stage
        - Tests are stored in `"./src"` folder relative to the **entry file** and follows the this format: `<FILENAME>.test.js`
- Directory Tree:  

    - ``` 
        i.e.
        |-  /app
            |-  /src 
                |- actions
                    |-  Calculator.js
                
            |-  /test
                |- /mandatory 
                    |- /subFolder
                        |- mandatory_test1.test.js
                        
                |- /open
                    |- /actions
                        |- Calculator.test.js
                        
                |- index.test.js
            
        ```  
  

## Quick start

- This quick start consist of 3 individual parts 
    1. Writing First Test Case
    2. Run ESLint against your codes

#### 1. Writing First Test Case:
- We will have two files in the following directory: 
    1. `./app/src/actions/Calculator.js`
    2. `./app/test/open/src/actions/Calculator.test.js`
    
- Proceed to write some code in `Calculator.js`
    - `Calculator.js`

    ``` javascript
        // Calculator.js
        function Calculator () {
            // Calculator Object
            this.add = function (x, y) {
                // a simple function to add two number
                return x + y;
            }
        }
        module.exports = Calculator;
    ```

- Now write your first test file
     - `calculator.test.js`
     
    ``` javascript
        // calculator.test.js
        var expect = require ("chai").expect;
        var Calculator = require ('../../../src/actions/Calculator.js');
        describe ("Calculator", function () {
            var calc;
            before (function () {
                calc = new Calculator ();
            });
            it ("Expect 2 + 3 = 5", function (done) {
                expect(calc.add(2,3)).to.equal(5);
                done();
            });
        });
    ```
- Open up terminal and run the following command 
    > npm run test
- Navigate to `./app/test/reports/` folder for your test reports
        
#### 2. Run ESLint against your codes

- Ensure that you have at least 1 `.js` file in your `./app/src/`
- Open your terminal and run the following command
    > npm run eslint
- Navigate to ./app/test/reports/ folder for your test reports 

#### 3. Continuous Integration - Jenkins & Rocketchat

 If you have set up your Jenkins to build when a change is pushed to gitlab and also hooked up rocketchat, pushing your project will automatically triggers the first two steps 

     npm run test
     npm run eslint

reports will be processed by jenkins and a summary of the reports will be sent to your rocketchat channel.

## Features
#### Tagging
- In the unit-test reports, test cases with tags will be specially isolated
- Tagging with `@@<Keyword>`  

    - ```javascript
        var expect = require ("chai").expect;
        describe ("Test suite", function (){
            it ("Tagged Test @@Important", function(done){
                expect (true).to.be.true;
            });
        });
      ```
    
## Configuration
#### project.config.js

- `reportsPaths`
    - This set of configuration will determine where the reports would be generated into, the three main set of reports generated are 
        1. `eslint reports`
        2. `unit test reports`
        3. `coverage reports`
    - Below are the explainations and the default values:
    
    - ```javascript

        // String: the base of the directory where the reports will go
        // relative to karma.base
        base: './test/reports',
    
        // Object: the different type of reports that will be generated
        types: {
    
            // Object: The setting for each type
            // eslint default
            eslint: {
    
                // String: folder directory to this type of reports relative to base
                dir: '/eslint',
    
                // String: common filename throughout
                filename: 'eslint-report',
    
                // Array(String) : the type of formats to be generated
                formats: ['checkstyle', 'json'],
    
                // Object: setting for if this report 
                // is to be sent to rocketchat
                rocketchat: {
    
                    // String: data type of the report data to be processed
                    data: 'json',
    
                    // Function(data:String): the function that will process the data
                    processor: processEslint
                }
            },
            
            // unitTest Default
            unitTest: {
                dir: '/unit-test',
                filename: 'unit-test-report',
                formats: ['junit'],
                rocketchat: {
                    data: 'junit',
                    processor: processUnitTest
                }
            },
            
            //coverage default
            coverage: {
                dir: '/coverage',
                filename: 'coverage-report',
                formats: ['cobertura', 'html', 'json']
            },

            // match format to file extension
            fileExtensions: {
                checkstyle: '.xml',
                junit: '.xml',
                cobertura: '.xml',
                html: '.html',
                json: '.json',
                default: '.txt'
            }
        }
        
        ```

- `karma`
    - This set of configuration deals with options passed to karma runner.
    - Below are the explainations and default values
    
    - ```javascript
        // String: path to base relative to karma.config.js
        base: '../app', 
    
        // String: path to test's entry file relative to base
        //      define more file in karma.config.js
        files: './test/index.test.js',
    
        // Array(String): a list of preprocessor for test's entry file ONLY
        //      define more preprocessors for other files in karma.config.js
        filePreprocessor:  ['webpack', 'coverage'],
    
        // String: path to webpack config relative to karma.config.js
        webpack: './webpack.config.js', 
    
        // Number: port number for karma server to run on
        port: 9876,

        // Array(String): a list of reporter karma will use
        reporters: [ 'progress', 'junit', 'coverage' ]

        // Object: a collection of reporters "<dataType>Reporter"
        // reporter options follow the individual official documentations
        reporterOptions: {
                //default values are automatically generated based on reportsPaths configuration, and each reporterOptions follows each karma reporter's configuration
            }
        }
        ```

- `eslint`
    - This set of configuration tells of the directory where all the files are to be checked by eslint
    - Explaination and default values: 
     
    - ```javascript
        // paths are relative to package.json
        // String: path to app folder
        pathToApp: './app', 
        // String: path to files to be checked
        files: './app/src'
        ```
## Built with:

- [`karma`](https://karma-runner.github.io/1.0/index.html)
- [`karma-junit-reporter`](https://www.npmjs.com/package/karma-junit-reporter)
- [`karma-htmlfile-reporter`](https://www.npmjs.com/package/karma-htmlfile-reporter)
- [`karma-coverage`](https://www.npmjs.com/package/karma-coverage)
- [`webpack`](https://webpack.js.org/)
- [`eslint`](http://eslint.org/)
- [`mocha`](https://mochajs.org/)
- [`phantomjs`](http://phantomjs.org/)
- [`phantomjs-prebuilt`](https://www.npmjs.com/package/phantomjs-prebuilt)
- [`xmldom`](https://www.npmjs.com/package/xmldom)
