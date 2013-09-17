
var env = process.env.NODE_ENV || "development",
	config = require("./config/config")[env];

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		sass: {
			dist: {
				options: {
					style: "expanded"
				},
				files: {
					"public/css/igodstil.css": "scss/igodstil.scss"
				}
			},
			prod: {
				options: {
					style: "compressed"
				},
				files: {
					"public/css/igodstil.min.css": "scss/igodstil.scss"
				}
			}
		},
		watch: {
			css: {
				files: "scss/**/*.scss",
				tasks: ["sass:dist"]
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.registerTask("default", ["watch"]);


	/*
	 * MongoDB
	 */
	grunt.registerTask("dbdrop", "drop the database", function() {
		var done = this.async(),
			mongoose = require("mongoose");

		mongoose.connect(config.db);
		mognoose.connection.on("open", function() {
			mongoose.connection.db.dropDatabase(function(err) {
				if (err) {
					console.log("Error: " + err);
					done(false);
				} else {
					console.log("Successfully dropped db");
					done();
				}
			});
		});
	});

};
