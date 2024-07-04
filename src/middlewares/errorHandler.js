module.exports = (err, req, res, next) => {
	console.error(err.stack);
	const error = {
		status: MSG.FAILED_STATUS,
		message: err.message || MSG.COMMON_ERROR
	};
	res.status(err.status).send(error);
};
