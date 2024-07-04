const express = require('express');

const users = require('../sevices/users');
const router = express.Router();

router.post('/register', Func.validate(Rules.userRegister), async (req, res, next) => {
	try {
		return await users.register(req, res, next);
	} catch (error) {
		console.log('REGISTER ERROR: ', error);
		res.status(500).json({ error: error.message });
	}
});

router.post('/login', Func.validate(Rules.login), async (req, res, next) => {
	try {
		return await users.login(req, res, next);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/validate', Func.validate(Rules.UserValidate), async (req, res, next) => {
	try {
		return await users.validate(req, res, next);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/activate', Func.validate(Rules.UserActivate), async (req, res, next) => {
	try {
		return await users.activate(req, res, next);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
