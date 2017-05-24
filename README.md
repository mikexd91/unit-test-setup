# Project Title
---
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus odio nec facilisis sodales. Curabitur sed est hendrerit, rutrum justo ut, consectetur odio.

## Getting Started
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus odio nec facilisis sodales. Curabitur sed est hendrerit, rutrum justo ut, consectetur odio.

## Built with
---
- `Karma`
- `Webpack`
- `eslint`
- `mocha`
- `phantomjs`
- `xmldom`

## Usage
---
#### Entry File: `index.test.js`
- The tests are carried out in two stage
    - ***Mandatory-Stage:*** 
        - Every test in this stage must pass in order to continue to Src-stage
        - Tests are stored in `"./mandatory"` folder relative to the **entry file**
    - ***Src-Stage***
        - The rest of the test are then carried out after the Mandatory-Stage
        - Tests are stored in `"./src"` folder relative to the **entry file**
- Directory Tree:
    - ```
        i.e.
        |-  /test
            |- /mandatory
                |- /subFolder
                    |- mandatory_test1.test.js
                    |- mmandatory_test2.test.js
            |- /src
                |- /components
                    |- some_test.test.js
            |- index.test.js
        ```  
  

#### Writing Test Cases:
- follows the standard Mocha Chai format 
- i.e.
    - ```javascript
        var expect = require("chai").expect;
        describe ("Suite name", function () {
            it ("Test name", function (done) {
                expect(true).to.be.true;
                done();
            });
        })  
      ```

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
---
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