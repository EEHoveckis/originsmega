const { MongoClient, ServerApiVersion } = require('mongodb');

module.exports = async function() {
	const client = new MongoClient(process.env.MONGO_URI, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		}
	});

	try {
		await client.connect();
		await client.db("master").command({ ping: 1 });
		console.log("Successfully connected to MongoDB!");

		module.exports.database = await client.db("master");
	} catch (err) {
		console.log(`Error Connecting To MongoDB!`);
	}
};
