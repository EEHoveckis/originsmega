module.exports.workPayment = async function(database, worker, job) {
	await database.collection("payments")
		.updateOne({ worker: worker }, { $push: { jobs: job } }, { upsert: true });
};

module.exports.orderPayment = async function(database, date, order) {
	await database.collection("orders")
		.updateOne({ date: date }, { $push: { orders: order } }, { upsert: true });
};
