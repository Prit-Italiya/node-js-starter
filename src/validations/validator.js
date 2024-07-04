global.Validator = require('validatorjs');

Validator.prototype._suppliedWithData = (attribute) => _.has(this.input, attribute);

Validator.register(
	'integer',
	function (value, requirement, attribute) {
		return _.isInteger(value);
	},
	'The :attribute must be an integer.'
);
Validator.register(
	'IsValidObjectID',
	function (value, requirement, attribute) {
		return ObjectId.isValid(value);
	},
	'The :attribute id is not valid.'
);
