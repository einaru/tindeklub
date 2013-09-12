
var env = process.env.NODE_ENV || "development",
	config = require("./config/config")[env];

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		sass: {
			dist: {
				files: {
					"public/css/igodstil.css": "scss/igodstil.scss"
				}
			}
		},
		watch: {
			css: {
				files: "scss/**/*.scss",
				tasks: ["sass"]
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.registerTask("default", ["watch"]);
				

	grunt.registerTask("say-hai", "Say hai!", function() {
		console.log("Hai!");
	});

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
