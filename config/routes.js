/*
 * config/routes.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var gear = require("../app/controllers/gear"),
	user = require("../app/controllers/user"),
	log = require("../app/controllers/log"),
	tinder = require("../lib/tinder")();

/*
 * Routes
 */

module.exports = function(app, passport) {

	// User routes
	app.get("/login", redirectIfAuthenticated, user.login);
	app.post("/login", passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: false
	}));
	app.get("/register", redirectIfAuthenticated, user.register);
	app.post("/register", user.create);
	app.get("/user/profile", ensureAuthenticated, user.profile);
	app.get("/logout", user.logout);

	// Gear routes
	app.get("/gear", gear.list);
	app.get("/gear/new", ensureAuthenticated, gear.new);
	app.get("/gear/new/:category", ensureAuthenticated, gear.newCategory);
	app.post("/gear", ensureAuthenticated, gear.create);
	app.get("/gear/:id", gear.show);
	app.get("/gear/:id/edit", ensureAuthenticated, gear.edit);
	app.put("/gear/:id", ensureAuthenticated, gear.update);
	app.del("/gear/:id", ensureAuthenticated, gear.remove);

	app.post("/gear/:id/log", ensureAuthenticated, log.create);

	// Index route
	app.get("/", function(req, res) {
		res.render("index", {
			images: tinder
		});
	});

	// Parameters
	app.param("id", gear.load);
	app.param("category", gear.loadCategory);
};

/*
 * Auth middleware
 */

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function redirectIfAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}
	next();
}
