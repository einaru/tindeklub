/*
 * config/config.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var path = require("path"),
	rootPath = path.normalize(__dirname + "/..");

module.exports = {
	development: {
		db: "mongodb://localhost/tindeklub-dev",
		root: rootPath,
		app: {
			name: "Tindeklub (devel)"
		}
	},
	test: {
		db: "mongodb://localhost/tindeklub-test",
		root: rootPath,
		app: {
			name: "Tindeklub (testing)"
		}
	}
}
