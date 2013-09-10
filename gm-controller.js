var mkdirp = require("mkdirp"),
	path = require("path"),
	fs = require("fs"),
	gm = require("gm");

var Image = require("mongoose").model("Image"),
	STATIC_DIR = path.normalize(__dirname + "/../public");

var MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif"
];

exports.index = function(req, res) {
	Image.list({}, function(err, images) {
		if (err) console.log(err);
		res.render("index", {
			images: images
		});
	});
};

exports.upload = function(req, res) {
	res.render("upload");
};

function throwIfErr(err) {
	if (err) throw err;
}

exports.save = function(req, res) {
	var files = req.files.images;

	if ("undefined" === typeof files.forEach) {
		files = [ files ];
	}

	files.forEach(function(file) {

		console.log(file.path);

		// Validate is image file
		if (!~MIME_TYPES.indexOf(file.type)) {
			console.log("Filetype '%s' is not supported!", file.type);
			return;
		}

		var img = new Image(),
			orgPath = path.join(STATIC_DIR, "img/model/" + img._id, file.name),
			orgDir = path.dirname(orgPath);

		mkdirp.sync(orgDir);
		fs.rename(file.path, orgPath, function(err) {
			if (err) throw err;

			img.versions.original = {
				path: orgPath, rel: path.relative(STATIC_DIR, orgPath)
			};

			// Variables for image versions
			var _path, _dir;

			// Create medium sized image
			_path = path.join(orgDir, "medium", file.name);
			_dir = path.dirname(_path);
			mkdirp.sync(_dir);
			gm(orgPath)
				.resize(500)
				.noProfile()
				.write(_path, throwIfErr);

			var dimensions = {};
			console.log("Dimensions obj before: %s", dimensions);
			(function(dimensions) {
				gm(_path).size(function(err, value) {
					console.log(value);
					dimensions.value = value;
				});
			})(dimensions);
			console.log("Dimensions obj after: %s", dimensions);

			img.versions.medium = {
				path: _path, rel: path.relative(STATIC_DIR, _path)
			};

			// Create thumbnail image
			_path = path.join(orgDir, "thumbnail", file.name);
			_dir = path.dirname(_path);
			mkdirp.sync(_dir);
			gm(orgPath)
				.resize(400)
				.gravity("Center")
				.crop(128, 128, 0, 0)
				.noProfile()
				.write(_path, throwIfErr);
			img.versions.thumbnail = {
				path: _path, rel: path.relative(STATIC_DIR, _path)
			};

			// Image properties
			img.name = file.name;
			img.type = file.type;

			img.save(throwIfErr);
		});
	});

	res.redirect("/");
};
