var input = process.argv[2];
var obj = JSON.parse(input);

var failCount = obj.failCount;
var passCount = obj.passCount;
var skipCount = obj.skipCount;

console.log("Test Result:\nFail Count: " + failCount + "\nPass Count: " + passCount + "\nSkip Count: " + skipCount);