module.exports.paymentId = async function(database) {
	const result = await database.collection("counters")
		.findOneAndUpdate({ _id: "payments" }, { $inc: { seq: 1 } }, { returnDocument: "after", upsert: true });

	return `#${result.seq}`;
};

module.exports.orderId = async function(database) {
	const result = await database.collection("counters")
		.findOneAndUpdate({ _id: "orders" }, { $inc: { seq: 1 } }, { returnDocument: "after", upsert: true });

	return `#${result.seq}`;
};
