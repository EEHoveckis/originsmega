const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const addPayment = require("../../helperFunctions/addPayment.js").workPayment;
const getId = require("../../helperFunctions/getId.js").paymentId;
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
		.addMentionableOption(option =>
			option.setName("worker")
			.setDescription("IGN of Worker")
			.setRequired(true)),

	async execute(interaction, database) {
		if (!interaction.member.roles.cache.has("1395130837665583288")) {
			const errorEmbed = new EmbedBuilder()
				.setColor("#c21717")
				.setDescription("You lack permissions to run this command!");

			await interaction.reply({ embeds: [errorEmbed] });
			return;
		}

		const worker = interaction.options.getMentionable("worker").nickname;
		const jobDesc = interaction.options.getString("job");
		const workerPay = interaction.options.getInteger("workerpay");

		const newId = await getId(database);
		const workerUUID = await fetchUUID(worker);

		const job = {
			jobId: newId,
			jobDesc: jobDesc,
			payment: workerPay
		};

		await addPayment(database, worker, job);

		const sourceEmbed = new EmbedBuilder()
			.setColor("#7b11bd")
			.setTitle(`${worker} | ${newId}`)
			.addFields({ name: "JOB DESCRIPTION:", value: `${jobDesc}` })
			.addFields({ name: "WORKER PAY:", value: `${workerPay}<:ruby:1365502815807602808>` })
			.setThumbnail(`https://api.mineatar.io/face/${workerUUID}?scale=32`)
			.setTimestamp()
			.setFooter({ text: `Submitted by ${interaction.member.user.username}`, iconURL: interaction.member.user.avatarURL() });

		await interaction.reply({ embeds: [sourceEmbed] });
	},
};
