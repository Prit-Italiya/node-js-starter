const jwt = require('jsonwebtoken');
const secret = Config.get('App.secret');
const tokenExpiresTime = Config.get('App.tokenExpiresTime');
const User = Models.User;

module.exports = {
	check: (req, res, next) => {
		const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

		if (!token) {
			return next(setError(MSG.AUTH_TOKEN_EMPTY, 403));
		} else {
			jwt.verify(token, secret, function (err, decoded) {
				if (err) {
					return next(setError(MSG.AUTH_TOKEN_FAILED, 403));
				} else {
					User.findById(decoded._id, { password: 0 }, function (err, user) {
						if (user == null) {
							return next(setError(MSG.USER_NOT_EXIST, 403));
						} else if (user.is_deleted) {
							return next(setError(MSG.LOGIN_DELETED, 403));
						} else if (user.status == USER_STATUS.IN_ACTIVE && user.activation_key == '') {
							return next(setError(MSG.LOGIN_DEACTIVE, 403));
						} else {
							req.user = user;
							const sessionDiff = Moment().diff(Moment.unix(decoded.iat), 'minutes');
							if (sessionDiff > 30) {
								const { email, _id, name } = req.user;
								const new_token = Auth.getToken({ email, _id, name });
								res.setHeader('x-access-token', new_token);
							} else {
								res.setHeader('x-access-token', token);
							}
							global.AuthUser = req.user;
							next();
						}
					});
				}
			});
		}
	},
	getToken: (user) =>
		jwt.sign(user, secret, {
			expiresIn: tokenExpiresTime // expires in 24 hours
		})
};
