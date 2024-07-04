require('../validations/validator');

const randomize = require('randomatic');

global.setError = (msg, code) => {
	if (msg && msg.code === 11000) {
		let keyValue = msg.keyValue;
		let field = '';
		for (key in keyValue) {
			console.log(key);
			let label = MSG[key];
			field = label + ' as ' + keyValue[key];
		}
		msg = 'Please use unique value for  ' + field + ' is already exists.';
	}
	if (_.isUndefined(code)) {
		code = 400;
	}
	var err = new Error(msg);
	err.status = code;
	return err;
};

global.empty = (value) => {
	if (!_.isUndefined(value)) {
		if ((typeof value == 'array' || typeof value == 'object') && _.isEmpty(value)) {
			return true;
		} else if (value == '') {
			return true;
		} else {
			return false;
		}
	}
	return true;
};
global.isset = (value) => {
	if (!_.isUndefined(value)) {
		return true;
	}
	return false;
};
global.ObjectIds = (ids) => {
	return _.map(ids, function (id) {
		return id ? ObjectId(id) : undefined;
	});
};

module.exports = {
	validate: (rules) => {
		return (req, res, next) => {
			const validation = new Validator(req.body, rules);
			if (validation.fails()) {
				const error = validation.errors.all();
				return next(setError(error[Object.keys(error)[0]][0]));
			} else {
				return next();
			}
		};
	},
	createRandomString: function (length = 6) {
		return randomize('a0', length);
	},
	setError,
	empty,
	isset,
	ObjectIds
};
