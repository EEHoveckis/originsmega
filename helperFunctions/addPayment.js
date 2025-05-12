const { operationsIGN } = require("../config.json");

module.exports = async function(database, sourcer, job, operationsJob) {
	await database.collection("payments")
		.updateOne({ sourcer: sourcer }, { $push: { jobs: job } }, { upsert: true });
	await database.collection("payments")
		.updateOne({ sourcer: operationsIGN }, { $push: { jobs: operationsJob } }, { upsert: true });
};
