/*
 * server.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var mongoose = require("mongoose"),
	express = require("express"),
	path = require("path"),
	fs = require("fs"),
	env = process.env.NODE_ENV || "development",
	config = require("./config/config")[env];

// Setup mongoDB connection
mongoose.connect(config.db);

// Bootstrap models
var modelsPath = path.join(config.root, "/app/models");
fs.readdirSync(modelsPath).forEach(function(file) {
	if(~file.indexOf(".js")) {
		require(path.join(modelsPath, file));
	}
});

// Setup express
var app = express();
require("./config/express")(app, config);

// Setup appliction routes
require("./config/routes")(app);

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Tindeklub kjører i god stil på http://localhost:" + port);

exports = module.exports = app;
