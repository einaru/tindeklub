/*
 * gravatar.js
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var crypto = require("crypto"),
	format = require("util").format,
	querystring = require("querystring");

var gravatar = module.exports = {

	/**
	 * Get a Gravatar URL
	 *
	 * Example usage:
	 *
	 *     var gravatar = require('gravatar');
	 *     var options = {
	 *         size: 200,
	 *         default: 404
	 *     };
	 *     gravatar.url("einar.uvslokk@gmail.com", options, https=true);
	 *
	 * @param {String} email The Gravatar email..
	 * @param {Object} options Query string options.
	 * @param {Boolean} https Whether or not to use secure gravatar.
	 * @api public
	 */
	url: function(email, options, https) {
		var baseURL = "%s.gravatar.com/avatar/",
			baseURL = format(baseURL, https ? "https://secure" : "http://www"),
			queryData = querystring.stringify(options),
			query = queryData ? "?" + queryData : "",
			email = email.toLowerCase().trim();

		return baseURL + crypto.createHash("md5").update(email).digest("hex") + query;
	}
};
