
var env = process.env.NODE_ENV || "development",
	config = require("./config/config")[env];

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		/*
		 * Create directories
		 */

		mkdir: {
			tmp: {
				options: {
					mode: 0700,
					create: [
						"tmp/cache",
						"tmp/uploads"
					]
				}
			},
			gearimg: {
				options: {
					create: [
						"public/img/gear"
					]
				}
			}
		},

		/*
		 * Cleanup
		 */

		clean: {
			tmp: [
				"tmp/cache",
				"tmp/uploads",
				//"tmp" // Might want to keep some tmp file!?
			],
			gearimg: [
				"public/img/gear"
			]
		},

		/*
		 * Express
		 */
		
		nodemon: {
			dev: {
				options: {
					file: "server.js",
					ignoredFiles: ["node_modules/**"],
					watchedExtensions: [".js"],
					env: {
						NODE_ENV: "development"
					},
					cwd: __dirname
				}
			}
		},

		/*
		 * Stylesheets
		 */

		sass: {
			dev: {
				options: {
					style: "expanded"
				},
				files: {
					"public/css/igodstil.css": "scss/igodstil.scss"
				}
			},
			min: {
				options: {
					style: "compressed"
				},
				files: {
					"public/css/igodstil.min.css": "scss/igodstil.scss"
				}
			}
		},

		/*
		 * Watch
		 */

		watch: {
			css: {
				files: "scss/**/*.scss",
				tasks: ["sass:dev"]
			}
		}
	});
	grunt.loadNpmTasks("grunt-mkdir");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-nodemon");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", ["nodemon"]);

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
