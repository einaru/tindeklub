/*
 * app/controllers/gear.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var mongoose = require("mongoose"),
	Gear = mongoose.model("Gear"),
	_ = require("underscore");


exports.load = function(req, res, next, id) {
	Gear.load(id, function(err, gear) {
		if (err) {
			return next(err);
		}
		if (!gear) {
			return next(new Error("not found"));
		}
		Gear.metadata(gear.category, function(metadata) {
			req.metadata = metadata;
			req.gear = gear;
			next();
		});
	});
};

exports.loadCategory = function(req, res, next, category) {
	Gear.metadata(category, function(metadata) {
		var gear = new Gear();
		gear.category = category;
		req.metadata = metadata;
		req.gear = gear;
		next();
	});
};

exports.list = function(req, res) {
	var options = {};
	Gear.list(options, function(err, gearList) {
		res.render("gear/list", {
			title: "Gear list",
			gearList: gearList
		});
	});
};

exports.new = function(req, res) {
	Gear.metadata(function(metadata) {
		res.render("gear/new", {
			title: "New gear",
			categories: metadata
		});
	});
};

exports.newCategory = function(req, res) {
	res.render("gear/new-category", {
		title: "New " + req.gear.category,
		gear: req.gear,
		metadata: req.metadata
	});
};

exports.create = function(req, res) {
	var gear = new Gear(req.body),
		images = req.files.images;

	gear.user = req.user;

	gear.uploadAndSave(images, function(err) {
		if (!err) {
			req.flash("info", "Successfully added new gear");
			return res.redirect("/gear/" + gear._id);
		}

		console.log(err);
		res.render("gear/new-category", {
			title: "New " + gear.category,
			gear: gear,
			metadata: req.metadata,
			errors: err
		});
	});
};

exports.show = function(req, res) {
	res.render("gear/show", {
		gear: req.gear,
		metadata: req.metadata
	});
};

exports.edit = function(req, res) {
	res.render("gear/edit", {
		title: "Edit gear",
		gear: req.gear
	});
};

exports.update = function(req, res) {
	var gear = req.gear,
		images = req.files.images;

	gear = _.extend(gear, req.body);

	gear.uploadAndSave(images, function(err) {
		if (!err) {
			req.flash("info", "Successfully updated gear");
			return res.redirect("/gear/" + gear._id);
		}
		res.render("gear/edit", {
			title: "Edit gear",
			gear: gear,
			errors: err
		});
	});
};

exports.remove = function(req, res) {
	var gear = req.gear;
	gear.remove(function(err) {
		req.flash("info", "Successfully removed gear");
		res.redirect("/gear");
	});
};

