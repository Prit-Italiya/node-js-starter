const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/Users');
require('dotenv').config();

exports.register = async (req, res, next) => {
	const { username, firstName, lastName, dob, phone, email, location } = req.body;

	// Generate the keypair

	// Hash the password before saving it to the database
	/* const salt = await bcrypt.genSalt(10);
	const password = await bcrypt.hash(data.password, salt); */

	// Add public and private keys to the data object
	const userData = {
		activation_key: Func.createRandomString(50),
		username,
		firstName,
		lastName,
		dob,
		phone,
		email,
		location
	};

	// Create a new user using the model and save it to the database
	const user = new User(userData);
	await user
		.save()
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			if (err) {
				return next(setError(MSG.EMAIL_EXIST));
			}
		});

	return res.send({
		data: null,
		message: MSG.REGISTER_SUCCESS
	});
};

exports.login = async (req, res, next) => {
	// Fetch the user from the database using email
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	// Check if the user exists
	if (!user) {
		throw new Error('Invalid credentials');
	}

	// Compare hashed password with the provided one
	user.isCorrectPassword(password, (err, same) => {
		if (err) {
			return next(setError(MSG.PASSWORD_NOT_GENERATE));
		} else if (!same) {
			return next(setError(MSG.LOGIN_INVALID, 401));
		} else {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: '1h'
			});
			user.jwtToken = token;

			user.save((err) => {
				// return user
				return res.send({
					data: user,
					message: MSG.REGISTER_SUCCESS
				});
			});
		}
	});
};

exports.validate = async (req, res, next) => {
	const { key, type = '' } = req.body;
	let condition = { activation_key: key };
	let msg = MSG.INVALID_ACTIVATION_LINK;

	if (type === 'reset') {
		condition = { password_reset_key: key };
		msg = MSG.INVALID_RESET_PASSWORD_LINK;
	}
	await User.findOne(condition, { password: 0 }).exec((err, user) => {
		if (user) {
			return res.send({
				data: user,
				message: MSG.DATA_FOUND
			});
		} else {
			return next(setError(msg, 401));
		}
	});
};

exports.activate = async (req, res, next) => {
	const { key, password, ...otherUserInfo } = req.body;
	await User.findOne({ activation_key: key }, { password: 0 }).exec((err, user) => {
		if (user) {
			global.AuthUser = user;
			user.activation_key = '';
			user.status = USER_STATUS.ACTIVE;
			user.password = password;
			user.activated_by = ACTIVATED_BY.USER;
			Object.assign(user, otherUserInfo);
			user.save((err) => {
				const payload = {
					email: user.user,
					_id: user._id,
					name: user.name
				};
				const token = Auth.getToken(payload);
				const userInfo = user.toJSON();
				userInfo.token = token;
				return res.send({
					data: { user: userInfo },
					message: MSG.ACTIVATION_SUCCESS
				});
				//User.updateLastLogin(user._id);
			});
		} else {
			return next(setError(MSG.INVALID_ACTIVATION_LINK, 401));
		}
	});
};
