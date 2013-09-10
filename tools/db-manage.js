#!/usr/bin/env node
/*
 * db-manage.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var sys = require("sys"),
	format = require("util").format,
	path = require("path"),
	env = process.env.NODE_ENV || "development",
	config = require("../config/config")[env],
	pkg = require("../package"),
	MongoClient = require("mongodb").MongoClient,
	ArgumentParser = require("argparse").ArgumentParser;

var parser = new ArgumentParser({
	version: pkg.version, addHelp: true,
	description: "Tindeklub db management."
});

parser.addArgument(["collection"], {
	type: "string",
	help: "The collection to perform actions against."
});
parser.addArgument(["-a", "--action"], {
	action: "store", type: "string",
	help: "The action to perform on [collection]."
});

function getDbName(connectionStr) {
	return connectionStr.split(/\//g).pop();
}

function doDump(collection, db) {
	sys.puts("To create a json dump, run:\n");
	sys.puts(format("mongoexport -d %s -c %s", getDbName(config.db), collection));
}

function doDrop(collection) {
	MongoClient.connect(config.db, function(err, db) {
		db.dropCollection(collection, function(err, result) {
			if (err) {
				sys.puts(format("*** error *** : %s", err));
			}
			db.close();
		});
	});
}

var args = parser.parseArgs();

switch (args.action) {
	case "dump":
		doDump(args.collection, config.db); break;
	case "drop":
		doDrop(args.collection, config.db); break;
	default:
		parser.printHelp();
}
