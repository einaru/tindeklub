/*
 * lib/humanize.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

module.exports = {
	str: {
		capitalize: function(s) {
			return s[0].toUpperCase() + s.slice(1).replace(/_/g, " ");
		}
	},
	date: {
		human: function(d) {
			return Date.parse(d) ? d.toDateString() : "";
		},
		iso: function(d) {
			return Date.parse(d) ? d.toISOString() : "";
		}
	},
	num: function(n) {
		return n;
	},
	bool: function(b) {
		return b ? "yes" : "no";
	}
}
