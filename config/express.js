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
	path = require("path"),
	MongoStore = require("connect-mongo")(express);

module.exports = function(app, config, passport) {
	app.configure(function() {
		app.set("showStackError", true);

		// Views
		app.set("views", path.join(config.root, "/views"));
		app.set("view engine", "jade");

		// Statics
		app.use(express.favicon(path.join(config.root, "/public/img/favicon.ico")));
		app.use(express.static(path.join(config.root, "/public")));

		app.use(express.bodyParser({
			uploadDir: config.uploadDir
		}));
		app.use(express.methodOverride());
		app.use(express.cookieParser());

		// Express/mongoDB session storage
		app.use(express.session({
			secret: "lvnghdrm",
			cookie: { maxAge: 14 * 24 * 3600000 },  // 2 weeks
			store: new MongoStore({
				url: config.db,
				collection: "sessions"
			})
		}));

		// Passport
		app.use(passport.initialize());
		app.use(passport.session());

		app.use(flash());
		app.use(app.router);

		// Locals
		app.locals.fmt = require(path.join(config.root, "/lib/fmt"));

		// Middlewares
		app.get("*", function(req, res, next) {
			res.locals.user = req.user;
			next();
		});
	});

	app.configure("development", function() {
		app.locals.pretty = true;
	});
};
