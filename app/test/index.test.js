var mandatoryAllPass = true;
describe ("Mandatory", function () {

	var isMandatory = true;
	var ctx = require.context('./mandatory', true, /\.test\.js$/);
	ctx.keys().forEach(ctx);
	
	afterEach (function () {
		if (isMandatory && "failed" == this.currentTest.state) {
			mandatoryAllPass = false;
		}
	});

	after (function () {
		isMandatory = false;
		if (mandatoryAllPass) 
			require ("./src/index.test.js");
	});
});