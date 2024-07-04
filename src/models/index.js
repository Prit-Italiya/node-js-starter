Fs.readdirSync(__dirname)
	.filter(function (file) {
		return file.indexOf('.') !== 0 && file !== 'index.js';
	})
	.forEach(function (file) {
		const filename = file.split('.')[0];
		const model = require(Path.join(__dirname, file));
		db[filename] = model;
	});
