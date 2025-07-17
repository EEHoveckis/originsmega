const fetch = require("node-fetch");

module.exports = async function(worker) {
	const res = await fetch(`https://api.minecraftservices.com/minecraft/profile/lookup/name/${worker}`);
	const json = await res.json();
	return json.id;
}
