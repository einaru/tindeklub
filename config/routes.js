/*
 * config/routes.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var gear = require("../app/controllers/gear");

module.exports = function(app) {
	app.get("/", function(req, res) {
		return res.redirect("/gear");
	});

	// Gear routes
	app.get("/gear", gear.list);
	app.get("/gear/new", gear.new);
	app.get("/gear/new/:category", gear.newCategory);
	app.post("/gear", gear.create);
	app.get("/gear/:id", gear.show);
	app.get("/gear/:id/edit", gear.edit);
	app.put("/gear/:id", gear.update);
	app.del("/gear/:id", gear.remove);

	var log = require("../app/controllers/log");
	app.post("/gear/:id/log", log.create);

	// Parameters
	app.param("id", gear.load);
	app.param("category", gear.loadCategory);
};
