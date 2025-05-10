const fetch = require("node-fetch");

module.exports = async function(username) {
	const res = await fetch(`https://api.minecraftservices.com/minecraft/profile/lookup/name/${username}`);
	const json = await res.json();
	return json.id;
}
