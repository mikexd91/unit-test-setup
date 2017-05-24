# Project Title

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus odio nec facilisis sodales. Curabitur sed est hendrerit, rutrum justo ut, consectetur odio.

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

    > npm run test
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
#### options.config.js
- `reportsPath:Object`
    - `base:String` --- the base of the directory where the reports will go 
        ***relative to karma.base*** 

    - `types:Object` --- the different type of reports that will be generated
    other attributes will be programatically generated 
    in the preprocess stage below
    relative to base
    
    - `type:Object` --- The setting for each type
        - `dir:String` ---  folder directory to this type of reports
           
        - `filename:String` ---  common filename throughout
        
        - `formats:Array(String)` ---  the type of formats to be generated
            - _the file directory will look like this:_ 

            - ```
                /karma.base
                    |-  /base
                        |-  /type1
                            |-  /format1
                                |- filename.ext1
                            |- /format2
                                |- filename.ext2
                        |- /type 2
                            |-  format1
                                |- filename.ext1

               ```
        
        - `rocketchat:Object` --- setting for if this report is to be sent to rocketchat
            - `data:String` --- data type of the report data to be processed
            
            - `processor:Function(data:String)` --- the function that will process the data
     
- `eslint:Object` 
    _paths are relative to package.json_
    
    - `pathToApp:String` --- path to app folder
    
    - `files:String` --- path to files to be checked

- `karma:Object`
    - `base:String` --- path to app's base ***relative to karma.config.js***
    
    - `files:String` --- path to test's entry file ***relative to base***
    
    - `fileProcessor:Array(String)` --- a list of preprocessor for ***test's entry file ONLY***
    
    - `webpack:String` --- path to webpack config ***relative to karma.config.js***
    
    - `port:Number` --- port number for karma server to run on
    
    - `reporters:Array(String)` --- a list of reporter karma will use
     
    - `reporterOptions:Object` --- a collection of reporters "<dataType>Reporter" 

        - ``` 
            reporterOptions = {
                htmlReporter: {
                    outputFile: reportsPaths.types.unitTest.outputFile.html
                },
            }
            ```
    - ***More Configuration can be set in Karma.config.js***
    
- `rocketchatChannel:String` --- name of the rocketchat channel to send reports to

## Built with

- `Karma`
- `Webpack`
- `eslint`
- `mocha`
- `phantomjs`
- `xmldom`