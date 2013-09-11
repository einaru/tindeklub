/*
 * app/controllers/user.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var mongoose = require("mongoose"),
	User = mongoose.model("User");


exports.login = function(req, res) {
	res.render("user/login");
};

exports.register = function(req, res) {
	res.render("user/register");
};

exports.profile = function(req, res) {
	res.render("user/profile", {
		user: req.user
	});
};

exports.create = function(req, res, next) {
	var user = new User(req.body);

	user.save(function(err) {
		if (err) {
			return next(err);
		}

		req.login(user, function(err) {
			if (err) {
				return next(err);
			}
			req.flash("info", "Profile successfully created");
			return res.redirect("/");
		});
	});
};

exports.logout = function(req, res) {
	req.logout();
	req.flash("info", "You are successfully logged out");
	res.redirect("/");
};
