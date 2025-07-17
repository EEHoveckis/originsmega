const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const addPayment = require("../../helperFunctions/addPayment.js").orderPayment;
const getId = require("../../helperFunctions/getId.js").orderId;
const fetchUUID = require("../../helperFunctions/fetchUUID.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("order")
		.setDescription("Command for order documentation")
		.addStringOption(option =>
			option.setName("orderdesc")
			.setDescription("Small Order Description")
			.setRequired(true))
		.addIntegerOption(option =>
			option.setName("paymentrec")
			.setDescription("Payment Received In Rubies")
			.setRequired(true)),

	async execute(interaction, database) {
		if (!interaction.member.roles.cache.has("1395130837665583288")) {
			const errorEmbed = new EmbedBuilder()
				.setColor("#c21717")
				.setDescription("You lack permissions to run this command!");

			await interaction.reply({ embeds: [errorEmbed] });
			return;
		}

		const orderDesc = interaction.options.getString("orderdesc");
		const paymentRec = interaction.options.getInteger("paymentrec");

		const newId = await getId(database);

		let date = new Date(Date.now());
		date = `0${date.getMonth() + 1}/${date.getFullYear()}`;
		const order = {
			orderId: newId,
			orderDesc: orderDesc,
			payment: paymentRec
		};

		await addPayment(database, date, order);

		const orderEmbed = new EmbedBuilder()
			.setColor("#7b11bd")
			.setTitle(`ORDER | ${newId}`)
			.addFields({ name: "ORDER DESCRIPTION:", value: `${orderDesc}` })
			.addFields({ name: "PAYMENT RECEIVED:", value: `${paymentRec}<:ruby:1365502815807602808>` })
			.setThumbnail("https://imgur.com/BJIQnLn.png")
			.setTimestamp()
			.setFooter({ text: `Submitted by ${interaction.member.user.username}`, iconURL: interaction.member.user.avatarURL() });

		await interaction.reply({ embeds: [orderEmbed] });
	},
};
