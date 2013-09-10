/*
 * lib/rmdir.js
 *
 * Provides a recursive version of fs.rmdir
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public Licence (GPL) version 3 or later
 */

var path = require("path"),
	fs = require("fs");

var rmdir = function(dir) {
	var list = fs.readdirSync(dir);
	for (var i = 0, l = list.length; i < l; i++) {
		var filename = path.join(dir, list[i]),
			stat = fs.statSync(filename);

		if (filename == "." || filename == "..") {
			continue;
		} else if (stat.isDirectory()) {
			rmdir(filename);
		} else {
			fs.unlinkSync(filename);
		}
	}
	fs.rmdirSync(dir);
};

exports = module.exports = rmdir;
