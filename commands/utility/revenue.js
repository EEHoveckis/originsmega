const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetchUUID = require("../../helperFunctions/fetchUUID.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("revenue")
		.setDescription("Retrieve info on revenue.")
		.addStringOption(option =>
			option.setName("date")
			.setDescription("Date MM/YYYY")
			.setRequired(true)),
	async execute(interaction, database) {
		const date = interaction.options.getString("date");

		if (!interaction.member.roles.cache.has("1395130837665583288")) {
			const errorEmbed = new EmbedBuilder()
				.setColor("#c21717")
				.setDescription("You lack permissions to run this command!");

			await interaction.reply({ embeds: [errorEmbed] });
			return;
		}

		const monthData = await database.collection("orders").findOne({ date: date });
		if (monthData == null) {
			const errorEmbed = new EmbedBuilder()
				.setColor("#c21717")
				.setDescription(`Data for **${date}** not found!`);

			await interaction.reply({ embeds: [errorEmbed] });
		} else {
			let totalRevenue = 0;
			let ordersData = "";

			if (monthData.orders.length == 0) {
				const errorEmbed = new EmbedBuilder()
					.setColor("#c21717")
					.setDescription(`Data for **${date}** not found!`);

				await interaction.reply({ embeds: [errorEmbed] });
			} else {
				for (var i = 0; i < monthData.orders.length; i++) {
					ordersData += `${monthData.orders[i].orderId} | ${monthData.orders[i].orderDesc} - ${monthData.orders[i].payment}<:ruby:1365502815807602808>\n`;
					totalRevenue += monthData.orders[i].payment;
				}

				const revenueEmbed = new EmbedBuilder()
					.setColor("#7b11bd")
					.setTitle(`REVENUE: ${date}`)
					.setDescription(ordersData)
					.addFields({ name: "TOTAL EARNINGS:", value: `${totalRevenue}<:ruby:1365502815807602808>` })
					.addFields({ name: "REVENUE DIVISION:", value: `${totalRevenue*0.7}<:ruby:1365502815807602808> | ${totalRevenue*0.1}<:ruby:1365502815807602808> | ${totalRevenue*0.1}<:ruby:1365502815807602808> | ${totalRevenue*0.1}<:ruby:1365502815807602808>` })
					.setThumbnail("https://imgur.com/BJIQnLn.png")
					.setTimestamp()
					.setFooter({ text: `Requested by ${interaction.member.user.username}`, iconURL: interaction.member.user.avatarURL() });

				await interaction.reply({ embeds: [revenueEmbed] });
			}
		}
	},
};
