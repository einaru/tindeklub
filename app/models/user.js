/*
 * app/models/user.js
 *
 * This file is part of Tindeklub
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	crypto = require("crypto"),
	format = require("util").format;

var UserSchema = new Schema({
	name: {
		first: { type: String },
		last: { type: String }
	},
	email: { type: String },
	hashed_password: { type: String },
	salt: { type: String }
});

/*
 * Virtuals
 */

UserSchema.virtual("password")
	.set(function(password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptPassword(password);
	})
	.get(function() {
		return this._password;
	});

UserSchema.virtual("fullname")
	.get(function() {
		return format("%s %s", this.name.first, this.name.last).trim();
	});

var validatePresenceOf = function(value) {
	return value && value.length;
};

/*
 * Validation
 */

UserSchema.path('name.first').validate(function (name) {
	return name.length;
}, 'Name cannot be blank');

UserSchema.path('name.last').validate(function (name) {
	return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
	return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
	var User = mongoose.model('User');

	// Check only when it is a new user or when email field is modified
	if (this.isNew || this.isModified('email')) {
		User.find({ email: email }).exec(function (err, users) {
			fn(!err && users.length === 0)
		});
	} else {
		fn(true);
	}
}, 'Email already exists')

UserSchema.path('hashed_password').validate(function (hashed_password) {
	return hashed_password.length;
}, 'Password cannot be blank')

/*
 * Hooks
 */

UserSchema.pre("save", function(next) {
	if (this.isNew) {
		return next();
	}

	if (!validatePresenceOf(this.password)) {
		next(new Error("Invalid password"));
	} else {
		next();
	}
});

/*
 * Methods
 */

UserSchema.methods = {
	authenticate: function(plain) {
		return this.encryptPassword(plain) === this.hashed_password;
	},

	makeSalt: function() {
		return Math.round((new Date().valueOf() * Math.random())) + "";
	},

	encryptPassword: function(password) {
		if (!password) {
			return "";
		}
		try {
			return crypto
				.createHmac("sha1", this.salt)
				.update(password)
				.digest("hex");
		} catch (e) {
			return "";
		}
	}
};

mongoose.model("User", UserSchema);

