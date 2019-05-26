const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chalk = require('chalk');

const PriceSnapshot = require('../models/PriceSnapshot');
const PriceEvaluation = require('../models/PriceEvaluation');
const Position = require('../models/Position');

dotenv.load({path: '.env'});

console.log('cleaning the database...');

mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', err => {
	console.error(err);
	console.log(
		'%s MongoDB connection error. Please make sure MongoDB is running.',
		chalk.red('✗')
	);
	process.exit();
});


const clean = async () => {
	await PriceSnapshot.deleteMany({});
	await PriceEvaluation.deleteMany({});
	await Position.deleteMany({});
};

clean().then(() => {
	console.log(chalk.green('done!'));
	process.exit();
});
