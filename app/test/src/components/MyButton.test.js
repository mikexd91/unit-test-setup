var MyButton = require ("../../../src/components/MyButton");
var chai = require ("chai");
var expect = chai.expect;

describe ("MyButton", function () {
	var myBtn;
	var id = 'myButton';

	before (function(){
		myBtn = new MyButton(id);
	})

	describe ("GET & SET id", function () {

		describe ("Foo", function () {
			it ("Should init with id = " + id, function (done) {
				expect(myBtn.id).to.equal(id);
				done();
			});

			var newId = "newMyButton";
			it ("Should set id = " + newId, function (done) {
				myBtn.id = newId;
				expect(myBtn.id).to.equal(newId);
				done();
			});
		});
	});

	describe ("Adding to parent", function () {
		it ("Should add to document.body", function (done) {
			myBtn.addTo(document.body);
			expect(document.getElementById(id) == null).to.be.false;
			done();
		})
	})
	
})