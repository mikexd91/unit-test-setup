var fs = require('fs');
var path = require('path');
var filePath = path.resolve(__dirname, "jenkinsInput.in");

fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        var json = JSON.parse(data);
		console.log("Test Result: \nFail Count: " + json.failCount + "\nPass Count: " + json.passCount + "\nSkip Count: " + json.skipCount);
    } else {
        console.log(err);
    }
});

function processData(data) {
	console.log("Process");
	var json = JSON.parse(data);
	console.log("Test Result: \nFail Count: " + json.failCount + "\nPass Count: " + json.passCount + "\nSkip Count: " + json.skipCount);
}