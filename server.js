/*
 * server.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var mongoose = require("mongoose"),
	passport = require("passport"),
	express = require("express"),
	path = require("path"),
	fs = require("fs"),
	env = process.env.NODE_ENV || "development",
	config = require("./config/config")[env];

// Setup mongoDB connection and load models
mongoose.connect(config.db);
var modelsPath = path.join(config.root, "/app/models");
fs.readdirSync(modelsPath).forEach(function(file) {
	if(~file.indexOf(".js")) {
		require(path.join(modelsPath, file));
	}
});

// Configure passport
require("./config/passport")(passport, config);

// Configure express
var app = express();
require("./config/express")(app, config, passport);

// Configure application routes
require("./config/routes")(app, passport);

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Tindeklub » i god stil @ http://localhost:" + port);

exports = module.exports = app;

