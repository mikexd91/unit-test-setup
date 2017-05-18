var fs = require('fs');
var filePath = "./jenkinsInput.in";

fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        processData(data);
    } else {
        console.log(err);
    }
});

function processData(data) {
	var json = JSON.parse(data);
	console.log("Test Result: \nFail Count: " + json.failCount 
			  + "\nPass Count: " + json.passCount 
			  + "\nSkip Count: " + json.skipCount);
}