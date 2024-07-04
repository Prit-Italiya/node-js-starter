const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	status: {
		type: String
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String
	},
	phone: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	dob: {
		type: Date,
		required: true
	},
	publicKey: {
		type: String
	},
	secretKey: {
		type: String
	},
	is_deleted: {
		type: Boolean,
		default: false
	}
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
	this.wasNew = this.isNew;
	const user = this;

	if ((!empty(this.password) && this.isNew) || user.isModified('password')) {
		const document = this;
		bcrypt.hash(this.password, saltRounds, function (err, hashedPassword) {
			if (err) {
				next(err);
			} else {
				document.password = hashedPassword;
				next();
			}
		});
	}

	next();
});

UserSchema.methods.isCorrectPassword = function (password, callback) {
	bcrypt.compare(password, this.password, function (err, same) {
		if (err) {
			callback(err);
		} else {
			callback(err, same);
		}
	});
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
