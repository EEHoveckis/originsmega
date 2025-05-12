const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetchUUID = require("../../helperFunctions/fetchUUID.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("payments")
		.setDescription("Retrieve info on payments.")
		.addStringOption(option =>
			option.setName("sourcer")
			.setDescription("IGN of Sourcer")
			.setRequired(true)),
	async execute(interaction, database) {
		const sourcer = interaction.options.getString("sourcer");

		const userData = await database.collection("payments").findOne({ sourcer: sourcer });
		let totalPay = 0;
		let paymentsData = "";
		for (var i = 0; i < userData.jobs.length; i++) {
			paymentsData += `${userData.jobs[i].jobDesc} - ${userData.jobs[i].payment}<:ruby:1365502815807602808>\n`;
			totalPay += userData.jobs[i].payment;
		}

		const sourcerUUID = await fetchUUID(sourcer);

		const paymentsEmbed = new EmbedBuilder()
			.setColor("#7b11bd")
			.setTitle(`Sourcer: ${sourcer}`)
			.setDescription(paymentsData)
			.addFields({ name: "TOTAL EARNINGS:", value: `${totalPay}<:ruby:1365502815807602808>` })
			.setThumbnail(`https://api.mineatar.io/face/${sourcerUUID}?scale=32`)
			.setTimestamp()
			.setFooter({ text: `Requested by ${interaction.member.user.username}`, iconURL: interaction.member.user.avatarURL() });

		await interaction.reply({ embeds: [paymentsEmbed] });
	},
};
