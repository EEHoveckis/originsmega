module.exports = async function(database) {
	const result = await database.collection("counters")
		.findOneAndUpdate({ _id: "payments" }, { $inc: { seq: 1 } }, { returnDocument: "after", upsert: true });

	return `OM#${result.seq}`;
};
