var sample = require ("../../../src/sample/sample");
var expect = require('chai').expect;

describe ("Sample Open", function () {
	it ("Should be a sample", function (done) {
		expect(sample()).to.equal('sample');
		done();
	});
});