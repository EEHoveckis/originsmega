module.exports = async function(database, sourcer, job, operationsJob) {
	await database.collection("payments")
		.updateOne({ sourcer: sourcer }, { $push: { jobs: job } }, { upsert: true });
	if (operationsJob.payment != 0) {
		await database.collection("payments")
			.updateOne({ sourcer: process.env.OPER_IGN }, { $push: { jobs: operationsJob } }, { upsert: true });
	} else {
		return;
	}
};
