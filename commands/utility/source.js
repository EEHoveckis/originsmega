const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const addPayment = require("../../helperFunctions/addPayment.js").workPayment;
const getId = require("../../helperFunctions/getId.js").paymentId;
const pricelist = require("../../pricelist.json");
const fetchUUID = require("../../helperFunctions/fetchUUID.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("source")
		.setDescription("Command for sourcing payment request.")
		.addStringOption(option =>
			option.setName("material")
			.setDescription("Material Gathered")
			.setRequired(true))
		.addIntegerOption(option =>
			option.setName("amount")
			.setDescription("Amount Of Shulkers Gathered")
			.setRequired(true))
		.addStringOption(option =>
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

		const material = interaction.options.getString("material");
		const amount = interaction.options.getInteger("amount");
		let worker = interaction.options.getString("worker");
		if (worker.startsWith("<@")) {
			worker = worker.replace(/<@|>/gm, "");
			worker = await interaction.guild.members.fetch(worker);
			worker = worker.nickname;
		}

		const materialInfo = pricelist.find(item => item.id === material);
		if (materialInfo == undefined) {
			const errorEmbed = new EmbedBuilder()
				.setColor("#c21717")
				.setDescription(`Block **${material}** not found!`);

			await interaction.reply({ embeds: [errorEmbed] });
		} else {
			const workerPay = Math.round(materialInfo.newstackpr * amount * 27 * 0.5);

			const newId = await getId(database);
			const workerUUID = await fetchUUID(worker);

			const job = {
				jobId: newId,
				jobDesc: `<:shulker:1365223044800446546> x${amount} ${materialInfo.blockname}`,
				payment: workerPay
			};

			await addPayment(database, worker, job);

			const sourceEmbed = new EmbedBuilder()
				.setColor("#7b11bd")
				.setTitle(`${worker} | ${newId}`)
				.addFields({ name: "MATERIAL:", value: `<:shulker:1365223044800446546> x${amount} ${materialInfo.blockname}` })
				.addFields({ name: "WORKER PAY:", value: `${workerPay}<:ruby:1365502815807602808>` })
				.setThumbnail(`https://api.mineatar.io/face/${workerUUID}?scale=32`)
				.setTimestamp()
				.setFooter({ text: `Submitted by ${interaction.member.user.username}`, iconURL: interaction.member.user.avatarURL() });

			await interaction.reply({ embeds: [sourceEmbed] });
		}
	},
};
