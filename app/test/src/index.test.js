describe ("src", function () {
	var ctx = require.context("/", true, /\.test\.js$/);
	ctx.keys().forEach(ctx);
});