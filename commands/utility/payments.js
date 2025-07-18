const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetchUUID = require("../../helperFunctions/fetchUUID.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("payments")
		.setDescription("Retrieve info on payments.")
		.addStringOption(option =>
			option.setName("worker")
			.setDescription("IGN of Worker")
			.setRequired(true)),
	async execute(interaction, database) {
		let worker = interaction.options.getString("worker");
		if (worker.startsWith("<@")) {
			worker = worker.replace(/<@|>/gm, "");
			worker = await interaction.guild.members.fetch(worker);
			worker = worker.nickname;
		}

		if (!interaction.member.roles.cache.has("1395130837665583288") && worker != interaction.member.nickname) {
			const errorEmbed = new EmbedBuilder()
				.setColor("#c21717")
				.setDescription("You lack permissions to view other users payments!");

			await interaction.reply({ embeds: [errorEmbed] });
			return;
		}

		const userData = await database.collection("payments").findOne({ worker: worker });
		if (userData == null) {
			const errorEmbed = new EmbedBuilder()
				.setColor("#c21717")
				.setDescription(`Data for **${worker}** not found!`);

			await interaction.reply({ embeds: [errorEmbed] });
		} else {
			let totalPay = 0;
			let paymentsData = "";

			if (userData.jobs.length == 0) {
				const errorEmbed = new EmbedBuilder()
					.setColor("#c21717")
					.setDescription(`Data for **${worker}** not found!`);

				await interaction.reply({ embeds: [errorEmbed] });
			} else {
				for (var i = 0; i < userData.jobs.length; i++) {
					paymentsData += `${userData.jobs[i].jobId} | ${userData.jobs[i].jobDesc} - ${userData.jobs[i].payment}<:ruby:1365502815807602808>\n`;
					totalPay += userData.jobs[i].payment;
				}

				const workerUUID = await fetchUUID(worker);

				const paymentsEmbed = new EmbedBuilder()
					.setColor("#7b11bd")
					.setTitle(`PAYMENTS: ${worker}`)
					.setDescription(paymentsData)
					.addFields({ name: "TOTAL EARNINGS:", value: `${totalPay}<:ruby:1365502815807602808>` })
					.setThumbnail(`https://api.mineatar.io/face/${workerUUID}?scale=32`)
					.setTimestamp()
					.setFooter({ text: `Requested by ${interaction.member.user.username}`, iconURL: interaction.member.user.avatarURL() });

				await interaction.reply({ embeds: [paymentsEmbed] });
			}
		}
	},
};
