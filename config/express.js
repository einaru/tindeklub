/*
 * config/express.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var express = require("express"),
	flash = require("connect-flash"),
	path = require("path");

module.exports = function(app, config) {
	app.set("showStackError", true);

	app.use(express.favicon(path.join(config.root, "/public/img/favicon.ico")));
	app.use(express.static(path.join(config.root, "/public")));

	app.set("views", path.join(config.root, "/views"));
	app.set("view engine", "jade");

	app.configure(function() {
		app.use(express.cookieParser("lvngthdrm"));
		app.use(express.session({ cookie: { maxAge: 60000 }}));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(flash());
		app.use(app.router);

		// Locals
		app.locals.fmt = require(path.join(config.root, "/lib/fmt"));
	});

	app.configure("development", function() {
		app.locals.pretty = true;
	});
};
