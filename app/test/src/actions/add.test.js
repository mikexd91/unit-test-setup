var add = require ('../../../src/actions/add');
var chai = require ('chai');
var expect = chai.expect;

describe ("A1", function () {
	describe ("B", function(){
		it ("Expect 2 + 3 = 5", function (done) {
			expect(add(2, 3)).to.equal(5);
			done();
		});
	});
});