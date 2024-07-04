const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');

global._ = require('lodash');
global.Config = require('config');
global.Fs = require('fs-extra');
global.Path = require('path');
global.Moment = require('moment-timezone');
global.AuthUser = null;
global.Func = require('./src/common/functions.js');
global.Rules = require('./src/validations/rules.js');
global.db = require('./config/database');
global.MSG = require('./src/common/locale/messages_en');
global.Models = require('./src/models');
global.Auth = require('./src/middlewares/auth.js');

const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const userRouter = require('./src/routes/users');

app.use(helmet());

app.use(
	cors({
		exposedHeaders: 'x-access-token',
		origin: true
	})
);

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'x-access-token,x-timezone,Content-Type, x-portal');
	res.header('Access-Control-Max-Age', 1728000);
	global.timezone = req.headers['x-timezone'];
	global.requestUrl = req.path;
	next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', userRouter);
app.get('/healthCheck', async (req, resp) => {
	resp.status(200).send('Server is running.');
});

app.use(errorHandler);

app.listen(8080, () => {
	console.log('Server is running on port 8080');
});

module.exports = app;
