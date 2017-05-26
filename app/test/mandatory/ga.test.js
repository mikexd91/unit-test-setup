var expect = require ("chai").expect();

describe ("GA Exist", function () {
	it ("Expect window.ga to be a function", function (done) {
		expect (typeof window.ga).to.equal('function');
	});
});