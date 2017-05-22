var add = require ('../../../src/actions/add');
var chai = require ('chai');
var expect = chai.expect;

describe ("A1", function () {
	describe ("B", function(){
		it ("foo1 @@SUPERRRRImpt", function (done) {
			expect(add(2, 3)).to.equal(6);
			done();
		});
	});
});