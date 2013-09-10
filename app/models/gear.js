/*
 * app/models/gear.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var mongoose = require("mongoose"),
	mkdirp = require("mkdirp"),
	path = require("path"),
	fs = require("fs"),
	gm = require("gm"),
	rmdir = require("../../lib/rmdir"),
	Schema = mongoose.Schema;

var STATIC_DIR = path.normalize(__dirname + "/../../public"),
	IMG_MIME_TYPES = [
		"image/jpeg",
		"image/png",
		"image/gif"
	];

function getCerts(c) {
	return c.join(",");
}

function setCerts(c) {
	return c.split(",");
}

var gearStates = ["never used", "in use", "retired", "lost", "sold"];

var GearSchema = new Schema({
	name: { type: String },
	manufacturer: { type: String },
	category: { type: String },
	state: { type: String, enum: gearStates, default: gearStates[0] },
	added: { type: Date, default: Date.now },
	last_modified: { type: Date },
	purcased: { type: Date },
	first_used: { type: Date },
	serial_number: { type: String },
	certifications: { type: [], get: getCerts, set: setCerts },
	tech_specs: {},
	usage_log: [{
		added: { type: Date, default: Date.now },
		date: { type: Date },
		// TODO add user field
		comment: { type: String }
	}],
	images: [{
		name: { type: String },
		type: { type: String },
		path: { type: String },
		rel: { type: String },
		versions: {
			medium: {
				path: { type: String },
				rel: { type: String }
			},
			thumbnail: {
				path: { type: String },
				rel: { type: String }
			}
		}
	}]
}, { collection: "gear" });


/**
 * Load gear category metadata definitions from json files.
 */
function getCategories() {
	var dir = path.normalize(__dirname + "/../../data/gear/categories"),
		categories = {};
	fs.readdirSync(dir).forEach(function(file) {
		if (~file.indexOf(".json")) {
			var cat = require(path.join(dir, file));
			categories[cat.name] = cat.attributes;
		}
	});

	return categories;
}


// Validation
GearSchema.path("name").validate(function(name) {
	return name.length > 0;
}, "Gear name cannot be blank");

GearSchema.path("manufacturer").validate(function(name) {
	return name.length > 0;
}, "Gear manufacturer cannot be blank");


// Pre-save hook
GearSchema.pre("save", function(next) {
	this.last_modified = new Date();
	next();
});

// Pre-remove hook
GearSchema.pre("remove", function(next) {
	var images = this.images;
	if (images.length) {
		rmdir(path.dirname(images[0].path));
	}
	next();
});


// Methods
GearSchema.methods = {
	/**
	 * Upload images and save gear
	 *
	 * @param {Object} images
	 * @param {Function} callback
	 * @api private
	 */
	uploadAndSave: function(images, callback) {
		if (!images || !images.length) {
			return this.save(callback);
		}

		var self = this;
		
		for (var i = 0, l = images.length; i < l; i++) {
			var file = images[i];
			console.log(file);
			if (!~IMG_MIME_TYPES.indexOf(file.type)) {
				console.log("Unsupported filetype '%s'", file.type);
				continue;
			}

			var _path = path.join(STATIC_DIR, "img/gear/" + self._id, file.name),
				_dir = path.dirname(_path);

			// Create directory and move image
			mkdirp.sync(_dir);
			fs.renameSync(file.path, _path);

			// Create medium sized image
			var medPath = path.join(_dir, "medium", file.name);
			mkdirp.sync(path.dirname(medPath));
			gm(_path).resize(500).noProfile()
				.write(medPath, function(err) {
					if (err) console.log("Error resizing image:\n%s", err);
				});

			// Create thumbnail
			var thumbPath = path.join(_dir, "thumb", file.name);
			mkdirp.sync(path.dirname(thumbPath));
			gm(_path).resize(400).gravity("Center").crop(128, 128, 0, 0).noProfile()
				.write(thumbPath, function(err) {
					if (err) console.log("Error creating thumbnail:\n%s", err);
				});

			// Add image
			self.images.push({
				name: file.name, type: file.type, path: _path,
				rel: path.relative(STATIC_DIR, _path),
				versions: {
					medium: {
						path: medPath,
						rel: path.relative(STATIC_DIR, medPath)
					},
					thumbnail: {
						path: thumbPath,
						rel: path.relative(STATIC_DIR, thumbPath)
					}
				}
			});

			console.log(self.images);
		}

		self.save(callback);
	},

	/**
	 * Add log entry
	 *
	 * @param {Object} entry
	 * @param {function} callback
	 * @api private
	 */
	addLogEntry: function(/*user, */entry, callback) {
		this.usage_log.push({
			date: entry.date,
			comment: entry.comment,
			//user: user._id
		});

		this.save(callback);
	}
}


// Static methods
GearSchema.statics = {
	/**
	 * Load gear by id
	 *
	 * @param {ObjectId} id
	 * @oaram {Function} callback
	 * @api private
	 */
	load: function(id, callback) {
		this.findOne({ _id: id })
			// TODO .populate("user", "name email username")
			// TODO .populate("usage_log.user", "name email username")
			.exec(callback);
	},

	/**
	 * Get a list of gear
	 *
	 * @param {Object} options
	 * @param {Function} callback
	 * @api private
	 */
	list: function(options, callback) {
		var criteria = options.criteria || {};
		this.find(criteria)
			// TODO .populate("user", "name username")
			.exec(callback);
	},

	/**
	 * Get metadata for a gear category
	 *
	 * @oaram {String} category
	 * @parma {Function} callback
	 * @api private
	 */
	metadata: function(category, callback) {
		var categories = getCategories();

		// TODO Hanle/provide errors
		if ("function" == typeof category) {
			callback = category;
			metadata = categories;
		} else {
			metadata = categories[category];
		}
		callback(metadata);
	}
}

mongoose.model("Gear", GearSchema);
