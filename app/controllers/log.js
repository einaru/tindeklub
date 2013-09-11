/*
 * app/models/gear.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var mongoose = require("mongoose");


exports.create = function(req, res) {
	var gear = req.gear,
		user = req.user;

	if (!req.body.comment) {
		return res.redirect("/gear/" + gear._id);
	}

	gear.addLogEntry(user, req.body, function(err) {
		if (err) {
			return res.render("500");
		}
		res.redirect("/gear/" + gear._id);
	});
};

