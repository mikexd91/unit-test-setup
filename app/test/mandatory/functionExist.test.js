var chai = require ('chai');
var utils = require ('../utils.js');
var expect = chai.expect;

describe ("ga exist", function(){
	before (function () {
		window.ga = function () {};
	});

	it ("Should exist", function(done){
		expect(typeof window.ga).to.equal("function");
		done();
	});

});