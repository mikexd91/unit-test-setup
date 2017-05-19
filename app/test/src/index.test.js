describe ("src", function () {

	//require all test cases in the src folder
	// var ctx = require.context("/", true, /\.test\.js$/);
	// ctx.keys().forEach(ctx);
	

	require ("./actions/add.test.js");
	require ("./components/MyButton.test.js");
	
});