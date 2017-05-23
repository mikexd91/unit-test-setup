# Karma-Webpack Unit Test Setup



## Installation

to be written 

## How to use

###### 1. Set paths to reports

Navigate to `reports_filepaths.js (./app/test/reports/utils/reports_filepath.js)` 
```javascript
    var path = {
        base: './base/path/to/all/test-folders'
        types: {
            //each type is a subfolder
            type1 : {
                dir: '/folder-name',
                filename: 'name-of-file-without-extension',
                formats: ['a', 'list', 'of', 'formats'] //i.e. ['junit', 'json']
            }
            ...
        }
    }
```
