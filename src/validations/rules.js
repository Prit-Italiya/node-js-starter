module.exports = {
	userRegister: {
		firstName: 'required',
		lastName: 'required',
		username: 'required',
		email: 'required|email',
		phone: 'required',
		location: 'required',
		dob: 'required|date'
	},
	login: {
		email: 'required|email',
		password: 'required'
	},
	UserResetPassword: {
		key: 'required',
		password: 'required'
	},
	UserValidate: {
		key: 'required'
	},
	UserActivate: {
		key: 'required',
		password: 'required'
	},
	UserForgot: {
		email: 'required'
	}
};
