/*
 * gravatar.js
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var fs = require('fs'),
	path = require('path'),
	tindeDir = path.normalize(__dirname + "/../public/img/tinder");

/**
 * Returns a random integer between min and max
 */
function randint(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function() {
	images = [];
	fs.readdirSync(tindeDir).forEach(function(img) {
		if(~img.indexOf('.jpg')) {
			images.push({
				data: 'data:image/jpg;base64,' + fs.readFileSync(path.join(tindeDir, img)).toString('base64')
			});
		}
	});
	return images;
};
