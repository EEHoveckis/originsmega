const connectMongo = require("./helperFunctions/connectMongo.js");
const loadCommands = require("./helperFunctions/loadCommands.js");
const { Client, Events, GatewayIntentBits } = require("discord.js");

(async function() {
	const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });
	client.login(process.env.DISCORD_TOKEN);

	const mongoClient = await connectMongo();
	const { database } = require("./helperFunctions/connectMongo.js");
	loadCommands(client);

	client.on(Events.ClientReady, readyClient => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	});

	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);

		try {
			await command.execute(interaction, database);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral });
			}
		}
	});
})();
