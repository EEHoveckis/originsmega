const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const addPayment = require("../../helperFunctions/addPayment.js");
const pricelist = require("../../pricelist.json");
const fetchUUID = require("../../helperFunctions/fetchUUID.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("csource")
		.setDescription("Command for custom sourcing payment request.")
		.addStringOption(option =>
			option.setName("material")
			.setDescription("Material Gathered")
			.setRequired(true))
		.addIntegerOption(option =>
			option.setName("amount")
			.setDescription("Amount Of Shulkers Gathered")
			.setRequired(true))
		.addIntegerOption(option =>
			option.setName("payment")
			.setDescription("Custom Payment In Rubies")
			.setRequired(true))
		.addStringOption(option =>
			option.setName("sourcer")
			.setDescription("IGN of Sourcer")
			.setRequired(true)),

	async execute(interaction, database) {

		const sourcer = interaction.options.getString("sourcer");
		const material = interaction.options.getString("material");
		const amount = interaction.options.getInteger("amount");
		const payment = interaction.options.getInteger("payment");

		const materialInfo = pricelist.find(item => item.id === material);
		if (materialInfo == undefined) {
			const errorEmbed = new EmbedBuilder()
				.setColor("#c21717")
				.setTitle("ERROR")
				.setDescription(`Block **${material}** not found!`);

			await interaction.reply({ embeds: [errorEmbed] });
		} else {
			const operationsPay = Math.round(materialInfo.newstackpr * amount * 27 * 0.15);
			const totalPay = payment + operationsPay;

			const sourcerUUID = await fetchUUID(sourcer);
			const job = {
				jobDesc: `<:shulker:1365223044800446546> x${amount} ${materialInfo.blockname}`,
				payment: payment
			};
			const operationsJob = {
				jobDesc: `<:shulker:1365223044800446546> x${amount} ${materialInfo.blockname}`,
				payment: operationsPay
			};

			await addPayment(database, sourcer, job, operationsJob);

			const sourceEmbed = new EmbedBuilder()
				.setColor("#7b11bd")
				.setTitle(`Sourcer: ${sourcer}`)
				.addFields({ name: "MATERIAL:", value: `<:shulker:1365223044800446546> x${amount} ${materialInfo.blockname}` })
				.addFields({ name: "SOURCER PAY:", value: `${payment}<:ruby:1365502815807602808>`, inline: true }, { name: "OPPERATIONS PAY:", value: `${operationsPay}<:ruby:1365502815807602808>`, inline: true })
				.addFields({ name: "TOTAL PAYMENT:", value: `${totalPay}<:ruby:1365502815807602808>` })
				.setThumbnail(`https://api.mineatar.io/face/${sourcerUUID}?scale=32`)
				.setTimestamp()
				.setFooter({ text: `Requested by ${interaction.member.user.username}`, iconURL: interaction.member.user.avatarURL() });

			await interaction.reply({ embeds: [sourceEmbed] });
		}
	},
};
