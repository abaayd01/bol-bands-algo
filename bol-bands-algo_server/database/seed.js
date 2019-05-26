const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chalk = require('chalk');
const CryptoCompareInterface = require('../lib/CryptoCompareInterface');

const PriceSnapshot = require('../models/PriceSnapshot');

dotenv.load({path: '.env'});

console.log('seeding the database...');

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


const seed = async () => {
	await PriceSnapshot.deleteMany({});

	const response = await CryptoCompareInterface.fetchHistoricalDailyPriceData(50);
	const priceSnapshotData = response.Data.map(dataPoint => {
		return {
			date: new Date(dataPoint.time * 1000),
			price: dataPoint.close
		}
	});
	await PriceSnapshot.insertMany(priceSnapshotData);
};

seed().then(() => {
	console.log(chalk.green('done!'));
	process.exit();
});
