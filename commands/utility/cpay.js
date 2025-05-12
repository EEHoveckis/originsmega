const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const addPayment = require("../../helperFunctions/addPayment.js");
const fetchUUID = require("../../helperFunctions/fetchUUID.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("cpay")
		.setDescription("Command for custom payment request.")
		.addStringOption(option =>
			option.setName("job")
			.setDescription("Custom Job Done")
			.setRequired(true))
		.addIntegerOption(option =>
			option.setName("workerpay")
			.setDescription("Payment To Worker In Rubies")
			.setRequired(true))
		.addIntegerOption(option =>
			option.setName("operationspay")
			.setDescription("Payment To Operations In Rubies")
			.setRequired(true))
		.addStringOption(option =>
			option.setName("sourcer")
			.setDescription("IGN of Sourcer")
			.setRequired(true)),

	async execute(interaction, database) {
		const sourcer = interaction.options.getString("sourcer");
		const jobDesc = interaction.options.getString("job")
		const workerPay = interaction.options.getInteger("workerpay");
		const operationsPay = interaction.options.getInteger("operationspay");

		const totalPay = workerPay + operationsPay;

		const sourcerUUID = await fetchUUID(sourcer);
		job = {
			jobDesc: jobDesc,
			payment: workerPay
		};
		const operationsJob = {
			jobDesc: jobDesc,
			payment: operationsPay
		};

		await addPayment(database, sourcer, job, operationsJob);

		const sourceEmbed = new EmbedBuilder()
			.setColor("#7b11bd")
			.setTitle(`Sourcer: ${sourcer}`)
			.addFields({ name: "JOB DESCRIPTION:", value: `${jobDesc}` })
			.addFields({ name: "WORKER PAY:", value: `${workerPay}<:ruby:1365502815807602808>`, inline: true }, { name: "OPPERATIONS PAY:", value: `${operationsPay}<:ruby:1365502815807602808>`, inline: true })
			.addFields({ name: "TOTAL PAYMENT:", value: `${totalPay}<:ruby:1365502815807602808>` })
			.setThumbnail(`https://api.mineatar.io/face/${sourcerUUID}?scale=32`)
			.setTimestamp()
			.setFooter({ text: `Requested by ${interaction.member.user.username}`, iconURL: interaction.member.user.avatarURL() });

		await interaction.reply({ embeds: [sourceEmbed] });
	},
};
