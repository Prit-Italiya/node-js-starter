global.Mongoose = require('mongoose');
global.ObjectId = Mongoose.Types.ObjectId;
const dbConfig = Config.get('Database');

let options = {
	dbName: dbConfig.dbName,
	useUnifiedTopology: true
};

Mongoose.connect(dbConfig.URL, options);
const mongodb = Mongoose.connection;

mongodb.on('error', console.error.bind(console, 'connection error:'));
mongodb.once('open', function () {
	console.log('connection developed');
});
Mongoose.set('debug', dbConfig.Debug);

const db = {
	mongoose: Mongoose
};

module.exports = db;
