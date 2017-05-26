var chai = require ('chai');
var expect = chai.expect;

describe ("sample mandatory", function(){
	it ("Should be mandatotry", function(done){
		expect('mandatory').to.equal("mandatory");
		done();
	});
});