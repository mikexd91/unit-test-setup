function MyButton (id) {
	this.id = id;
	var div = document.createElement('div');
	div.id = id;
	this.div = div;

	this.addTo = function (target) {
		target.appendChild(div);
	}
}

module.exports = MyButton;