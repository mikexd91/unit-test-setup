// a flag to see if all mandatory test cases passed
var mandatoryAllPass = true;

describe ("Mandatory", function () {

	// require all test cases in the mandatory folder
	// and run the tests

	var ctx = require.context('./mandatory', true, /\.test\.js$/);
	ctx.keys().forEach(ctx);
	
	// a flag to prevent non-mandatory test to call this 
	// afterEach block
	var isMandatory = true;
	afterEach (function () {
		if (isMandatory && "failed" == this.currentTest.state) {
			mandatoryAllPass = false;
		}
	});

	// executes after all the mandatory test finish.
	after (function () {
		isMandatory = false;

		// if all mandatory case passes
		// require src/index.test.js which contains
		// the path to all test cases in src folder
		if (mandatoryAllPass) 
			require ("./src/index.test.js");
	});
});